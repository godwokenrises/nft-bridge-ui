import { Wallet } from "ethers";
import { helpers, BI } from "@ckb-lumos/lumos";
import { Cell, CellDep, Hash, HexString, Transaction } from "@ckb-lumos/base";
import { minimalCellCapacityCompatible } from "@ckb-lumos/helpers";
import { Nrc721Sdk, Nrc721NftData } from "../sdk";
import { findNrc721ConfigFromNftData } from "./config";
import { AppLumosConfig, AppNrc721Config } from "@/constants/AppEnvironment";
import { AppCkbIndexer, AppCkbIndexerUrl, AppCkbRpcUrl } from "@/constants/AppEnvironment";
import { minimalOmniLockPureCellCapacity, signOmniLockTransactionSkeleton } from "@/modules/OmniLock";
import { collectPaymentCells } from "@/modules/Ckb";

export async function getSupportedNrc721NftList(address: HexString) {
  const Nrc721Service = await Nrc721Sdk.initialize({
    indexerUrl: AppCkbIndexerUrl,
    nodeUrl: AppCkbRpcUrl,
  });

  const lock = helpers.parseAddress(address, {
    config: AppLumosConfig,
  });

  const codeHashes = AppNrc721Config.configs.map((con) => con.nftScriptCodeHash);
  function collect(nftScriptCodeHash: string) {
    const collector = AppCkbIndexer.collector({
      lock,
      type: {
        codeHash: nftScriptCodeHash,
        hashType: "type",
        args: "0x",
      },
    });

    return collector.collect();
  }

  const cells: Nrc721NftData[] = [];
  for (const codeHash of codeHashes) {
    for await (const cell of collect(codeHash)) {
      const type = cell.cellOutput.type;
      if (type && await Nrc721Service.nftCell.isCellNRC721(type)) {
        const data: Nrc721NftData = await Nrc721Service.nftCell.read(type);
        cells.push(data);
      }
    }
  }

  console.log("nrc721 cells:", cells);
  return cells;
}

export interface SendNrc721NftPayload {
  nftData: Nrc721NftData;
  fromAddress: string;
  toAddress: string;
  signer: Wallet;
}

export async function sendNrc721Nft(payload: SendNrc721NftPayload) {
  const Nrc721Service = await Nrc721Sdk.initialize({
    indexerUrl: AppCkbIndexerUrl,
    nodeUrl: AppCkbRpcUrl,
  });

  const unsignedTx = await generateSendNrc721NftTransaction(payload);

  let signedTx: Transaction;
  try {
    console.log("signing transaction", unsignedTx);
    signedTx = await signOmniLockTransactionSkeleton(unsignedTx, payload.signer);
  } catch(e) {
    console.error("Sign transaction failed:", e);
    throw e;
  }

  let txHash: Hash;
  try {
    console.log("sending transaction", signedTx);
    txHash = await Nrc721Service.ckb.rpc.sendTransaction(signedTx, "passthrough");
  } catch(e) {
    console.error("Send transaction failed:", e);
    throw e;
  }

  return txHash;
}

export async function generateSendNrc721NftTransaction(payload: SendNrc721NftPayload) {
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
  const omniLockCellDep: CellDep = {
    outPoint: {
      txHash: AppLumosConfig.SCRIPTS.OMNILOCK.TX_HASH,
      index: AppLumosConfig.SCRIPTS.OMNILOCK.INDEX,
    },
    depType: AppLumosConfig.SCRIPTS.OMNILOCK.DEP_TYPE,
  };
  const secp256k1Blake160CellDep: CellDep = {
    outPoint: {
      txHash: AppLumosConfig.SCRIPTS.SECP256K1_BLAKE160.TX_HASH,
      index: AppLumosConfig.SCRIPTS.SECP256K1_BLAKE160.INDEX,
    },
    depType: AppLumosConfig.SCRIPTS.SECP256K1_BLAKE160.DEP_TYPE,
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

  // 2.2 List needed capacity
  const minimalFeeCapacity = BI.from(10000);
  const nftCellNeededCapacity = minimalCellCapacityCompatible(nftCell);
  const exchangeCellNeededCapacity = minimalOmniLockPureCellCapacity(AppLumosConfig);

  console.log("nftCellNeededCapacity", nftCellNeededCapacity.toString());
  console.log("exchangeCellNeededCapacity", exchangeCellNeededCapacity.toString());

  // 2.3 List needed/collected capacity
  let neededCapacity = BI.from(nftCellNeededCapacity).add(minimalFeeCapacity);
  let collectedCapacity = BI.from(nftCell.cellOutput.capacity);
  let collectedCells: Cell[] = [];

  // 2.4 If collected capacity is not exactly matched to needed capacity
  if (!collectedCapacity.eq(neededCapacity)) {
    // 2.4.1 Update needed capacity, then collect extra capacity
    neededCapacity = neededCapacity.add(exchangeCellNeededCapacity);
    const payment = await collectPaymentCells({
      neededCapacity: neededCapacity.sub(nftCellNeededCapacity),
      address: payload.fromAddress,
      indexer: AppCkbIndexer,
      lumosConfig: AppLumosConfig,
    });

    console.log("payment", payment.capacity.toString(), payment.cells);

    // 2.4.2 Update status after collected
    if (collectedCapacity.add(payment.capacity).gte(neededCapacity)) {
      collectedCapacity = collectedCapacity.add(payment.capacity);
      collectedCells = payment.cells;
    } else {
      throw new Error("Insufficient capacity");
    }
  }

  // 3. Build outputs: [outputNftCell, exchangeCell]
  // 3.1 Generate output nftCell
  const outputNftCell: Cell = {
    cellOutput: {
      ...nftCell.cellOutput,
      capacity: nftCellNeededCapacity.toHexString(),
      lock: helpers.parseAddress(payload.toAddress, {
        config: AppLumosConfig,
      }),
    },
    data: nftCell.data,
  };

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

  console.log("neededCapacity", neededCapacity.toString());
  console.log("collectedCapacity", collectedCapacity.toString());
  console.log("extraCapacity", extraCapacity.toString());
  console.log("exchangeCapacity", exchangeCapacity.toString());

  // 4. Generate transaction
  // 4.1 Generate transaction skeleton
  let txSkeleton = helpers.TransactionSkeleton({
    cellProvider: AppCkbIndexer,
  });

  // 4.1 Fill transaction
  txSkeleton = txSkeleton
    .update("cellDeps", (cellDeps) => {
      return cellDeps.push(omniLockCellDep, secp256k1Blake160CellDep, nftCellDep, factoryCellDep);
    })
    .update("inputs", (inputs) => {
      return inputs.push(nftCell, ...collectedCells);
    })
    .update("outputs", (outputs) => {
      return outputs.push(outputNftCell, exchangeCell);
    });

  return txSkeleton;
}
