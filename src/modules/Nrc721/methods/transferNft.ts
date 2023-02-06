import { BI, helpers, RPC } from "@ckb-lumos/lumos";
import { Cell, CellDep, Hash, Transaction } from "@ckb-lumos/base";
import { minimalCellCapacityCompatible } from "@ckb-lumos/helpers";
import { findNrc721NftScriptConfigByNftData, Nrc721NftData } from "@/modules/Nrc721";
import { calculateTransactionFee, collectPaymentCells, getTypeIdCellByTypeScript } from "@/modules/Ckb";
import { minimalUnipassLockPureCellCapacity } from "@/modules/Unipass";

import { AppCkbRpcUrl, AppLumosConfig, AppNrc721Config, AppUnipassConfig } from "@/constants/AppEnvironment";
import { AppCkbIndexer } from "@/constants/AppEnvironment";

export interface SendNrc721NftPayload {
  nftData: Nrc721NftData;
  fromAddress: string;
  toAddress: string;
  minimalFee?: BI | string;
  estimatedFee?: BI | string;
  additionalFee?: BI | string;
  transformNftCell?: (nftCell: Cell) => Cell;
  signTransactionSkeleton: (txSkeleton: helpers.TransactionSkeletonType) => Promise<Transaction>;
}

export interface Nrc721NftTransferResult {
  txSkeleton: helpers.TransactionSkeletonType;
  totalCostCapacity: BI;
  transactionFee: BI;
}

export async function sendNrc721Nft(payload: SendNrc721NftPayload): Promise<Hash> {
  const { txSkeleton: unsignedTx } = await generateNrc721NftTransferTransaction(payload);
  const signedTx = await payload.signTransactionSkeleton(unsignedTx);

  console.log("sending transaction", signedTx);

  const rpc = new RPC(AppCkbRpcUrl);
  return await rpc.sendTransaction(signedTx);
}

export async function generateNrc721NftTransferTransaction(payload: SendNrc721NftPayload): Promise<Nrc721NftTransferResult> {
  // 1. Build cellDeps: nftCellTypeScript, factoryCellTypeScript, omniLockCellDep
  // 1.1 Get Nrc721NftScriptConfig from nftData
  const nftScriptConfig = findNrc721NftScriptConfigByNftData(payload.nftData, AppNrc721Config);
  if (!nftScriptConfig) throw new Error("Nrc721NftScriptConfig not found");

  // 1.2 Get CellDeps
  const nftScriptCell = await getTypeIdCellByTypeScript(nftScriptConfig.typeScript, AppCkbIndexer);
  const nftCellDep: CellDep = {
    outPoint: nftScriptCell.outPoint!,
    depType: "code",
  };

  // 2. Collect inputs: [nftCell, pureCkbCells]
  // 2.1 Generate nftCell, then calculate occupied capacity of output nftCell
  const nftCell: Cell = {
    cellOutput: {
      capacity: payload.nftData.rawCell.capacity,
      lock: payload.nftData.rawCell.lock,
      type: payload.nftData.rawCell.type,
    },
    data: payload.nftData.rawCell.data,
    outPoint: payload.nftData.rawCell.outPoint,
  };
  const outputNftCell: Cell = transformNrc721OutputNftCell(
    {
      cellOutput: {
        ...nftCell.cellOutput,
        lock: helpers.parseAddress(payload.toAddress, {
          config: AppLumosConfig,
        }),
      },
      data: nftCell.data,
    },
    payload
  );

  // 2.2 List needed capacity
  const estimatedFeeCapacity = await calculateNrc721TransferEstimatedFee(payload);
  const nftCellNeededCapacity = minimalCellCapacityCompatible(outputNftCell);
  const exchangeCellNeededCapacity = minimalUnipassLockPureCellCapacity(AppUnipassConfig);

  console.log("estimatedFeeCapacity", estimatedFeeCapacity.toString());

  // 2.3 List needed/collected capacity
  let neededCapacity = BI.from(nftCellNeededCapacity).add(estimatedFeeCapacity).add(exchangeCellNeededCapacity);
  let collectedCapacity = BI.from(nftCell.cellOutput.capacity);
  let collectedCells: Cell[] = [];

  // 2.4 Record return status
  const totalCostCapacity = neededCapacity.sub(exchangeCellNeededCapacity);

  // 2.5 If collected capacity is not enough
  if (collectedCapacity.lt(neededCapacity)) {
    // 2.5.1 Collect payment pure ckb cells
    const payment = await collectPaymentCells({
      neededCapacity: neededCapacity.sub(collectedCapacity),
      address: payload.fromAddress,
      indexer: AppCkbIndexer,
      lumosConfig: AppLumosConfig,
    });

    console.log("payment", payment.capacity.toString(), payment.cells);

    // 2.5.2 Update status after collected
    if (collectedCapacity.add(payment.capacity).gte(neededCapacity)) {
      collectedCapacity = collectedCapacity.add(payment.capacity);
      collectedCells = payment.cells;
    } else {
      const failedNeededCapacity = neededCapacity.toString();
      const failedCollectedCapacity = collectedCapacity.add(payment.capacity).toString();
      throw new Error(`Insufficient capacity, required ${failedNeededCapacity} but collected ${failedCollectedCapacity}`);
    }
  }

  // 3. Build outputs: [outputNftCell, exchangeCell]
  // 3.1 Generate output nftCell
  outputNftCell.cellOutput.capacity = nftCellNeededCapacity.toHexString();

  // 3.2 Generate output exchangeCell
  const extraCapacity = collectedCapacity.sub(neededCapacity);
  const exchangeCapacity = extraCapacity.add(exchangeCellNeededCapacity);
  const exchangeCell: Cell = {
    cellOutput: {
      capacity: exchangeCapacity.toHexString(),
      lock: helpers.parseAddress(payload.fromAddress, {
        config: AppLumosConfig,
      }),
    },
    data: "0x"
  };

  // 4. Generate transaction
  // 4.1 Generate transaction skeleton
  let txSkeleton = helpers.TransactionSkeleton({
    cellProvider: AppCkbIndexer,
  });

  // 4.1 Fill transaction
  txSkeleton = txSkeleton
    .update("cellDeps", (cellDeps) => {
      return cellDeps.push(nftCellDep);
    })
    .update("inputs", (inputs) => {
      return inputs.push(nftCell, ...collectedCells);
    })
    .update("outputs", (outputs) => {
      return outputs.push(outputNftCell, exchangeCell);
    });

  return {
    txSkeleton,
    totalCostCapacity: totalCostCapacity,
    transactionFee: estimatedFeeCapacity,
  };
}

function transformNrc721OutputNftCell(cell: Cell, payload: SendNrc721NftPayload) {
  return payload.transformNftCell ? payload.transformNftCell(cell) : cell;
}

export async function calculateNrc721TransferEstimatedFee(payload: SendNrc721NftPayload): Promise<BI> {
  if (payload.estimatedFee) {
    return BI.from(payload.estimatedFee);
  }

  const feeUnit = BI.from(1_0000_0000);
  const minimalFee = BI.from(payload.minimalFee || feeUnit);
  const { txSkeleton: simulatedTxSkeleton } = await generateNrc721NftTransferTransaction({
    ...payload,
    estimatedFee: minimalFee,
  });
  const tx = helpers.createTransactionFromSkeleton(simulatedTxSkeleton);

  const additionalFee = BI.from(payload.additionalFee || "0");
  const estimatedFee = await calculateTransactionFee(tx, AppCkbRpcUrl);
  const estimatedFeeWithAddition = estimatedFee.add(additionalFee);
  if (estimatedFeeWithAddition.lt(minimalFee)) {
    return estimatedFeeWithAddition;
  }

  const exceedRate = estimatedFeeWithAddition.div(feeUnit).toNumber();
  const calculatedFee = feeUnit.mul(Math.ceil(exceedRate));
  return await calculateNrc721TransferEstimatedFee({
    ...payload,
    minimalFee: calculatedFee,
  });
}
