import { BI, helpers } from "@ckb-lumos/lumos";
import { Cell, CellDep, Hash, Transaction } from "@ckb-lumos/base";
import { minimalCellCapacityCompatible } from "@ckb-lumos/helpers";
import { findNrc721ConfigFromNftData, Nrc721NftData } from "@/modules/Nrc721";
import { minimalUnipassLockPureCellCapacity } from "@/modules/Unipass";
import { collectPaymentCells } from "@/modules/Ckb";

import { AppLumosConfig, AppNrc721Config, AppUnipassConfig } from "@/constants/AppEnvironment";
import { AppCkbIndexer } from "@/constants/AppEnvironment";

export interface SendNrc721NftPayload {
  nftData: Nrc721NftData;
  fromAddress: string;
  toAddress: string;
  transformNftCell?: (nftCell: Cell) => Cell;
  signTransactionSkeleton: (txSkeleton: helpers.TransactionSkeletonType) => Promise<Transaction>;
  sendTransaction(tx: Transaction): Promise<Hash>;
}

export async function sendNrc721Nft(payload: SendNrc721NftPayload) {
  /*const Nrc721Service = await Nrc721Sdk.initialize({
    indexerUrl: AppCkbIndexerUrl,
    nodeUrl: AppCkbRpcUrl,
  });*/

  const unsignedTx = await generateNrc721NftTransferTransaction(payload);
  console.log("before signing transaction", unsignedTx);

  let signedTx: Transaction;
  try {
    signedTx = await payload.signTransactionSkeleton(unsignedTx);
    // signedTx = await signOmniLockTransactionSkeleton(unsignedTx, payload.signer);
  } catch(e) {
    console.error("Sign transaction failed:", e);
    throw e;
  }

  let txHash: Hash;
  try {
    console.log("sending transaction", signedTx);
    txHash = await payload.sendTransaction(signedTx);
    // txHash = await Nrc721Service.ckb.rpc.sendTransaction(signedTx, "passthrough");
  } catch(e) {
    console.error("Send transaction failed:", e);
    throw e;
  }

  return txHash;
}

export async function generateNrc721NftTransferTransaction(payload: SendNrc721NftPayload) {
  // 1. Build cellDeps: nftCellTypeScript, factoryCellTypeScript, omniLockCellDep
  // 1.1 Get Nrc721Config from the target nft
  const nrc721Config = findNrc721ConfigFromNftData(payload.nftData, AppNrc721Config);
  if (!nrc721Config) {
    throw new Error("Nrc721Config not found");
  }

  // 1.2 Get CellDep list
  const nftCellDep: CellDep = {
    outPoint: {
      txHash: nrc721Config.nftCellDep.txHash,
      index: nrc721Config.nftCellDep.index,
    },
    depType: nrc721Config.nftCellDep.depType as CellDep["depType"],
  };
  const factoryCellDep: CellDep = {
    outPoint: {
      txHash: nrc721Config.factoryCellDep.txHash,
      index: nrc721Config.factoryCellDep.index,
    },
    depType: nrc721Config.factoryCellDep.depType as CellDep["depType"],
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
  const outputNftCell: Cell = transformOutputNftCell(
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
  const minimalFeeCapacity = BI.from(10000);
  const nftCellNeededCapacity = minimalCellCapacityCompatible(outputNftCell);
  const exchangeCellNeededCapacity = minimalUnipassLockPureCellCapacity(AppUnipassConfig);

  // 2.3 List needed/collected capacity
  let neededCapacity = BI.from(nftCellNeededCapacity).add(minimalFeeCapacity);
  let collectedCapacity = BI.from(nftCell.cellOutput.capacity);
  let collectedCells: Cell[] = [];

  // 2.4 If collected capacity is not exactly matched to needed capacity
  if (!collectedCapacity.eq(neededCapacity)) {
    neededCapacity = neededCapacity.add(exchangeCellNeededCapacity);
  }

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
      return cellDeps.push(nftCellDep, factoryCellDep);
    })
    .update("inputs", (inputs) => {
      return inputs.push(nftCell, ...collectedCells);
    })
    .update("outputs", (outputs) => {
      return outputs.push(outputNftCell, exchangeCell);
    });

  return txSkeleton;
}

export function transformOutputNftCell(cell: Cell, payload: SendNrc721NftPayload) {
  return payload.transformNftCell ? payload.transformNftCell(cell) : cell;
}
