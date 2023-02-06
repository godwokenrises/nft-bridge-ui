import { Hash, HexString } from "@ckb-lumos/base";
import { addNrc721BridgeExtraToNftCell } from "./bridge";
import { generateNrc721NftTransferTransaction, sendNrc721Nft } from "./transferNft";
import { SendNrc721NftPayload, Nrc721NftTransferResult } from "./transferNft";

import { AppNrc721Config } from "@/constants/AppEnvironment";

export interface DepositNrc721Payload extends Omit<SendNrc721NftPayload, "toAddress"> {
  ethAddress: HexString;
}

export function generateNrc721DepositTransaction(payload: DepositNrc721Payload): Promise<Nrc721NftTransferResult> {
  const toAddress = AppNrc721Config.bridgeAddress;

  return generateNrc721NftTransferTransaction({
    transformNftCell: (cell) => addNrc721BridgeExtraToNftCell(cell, payload.ethAddress),
    toAddress: toAddress,
    ...payload,
  });
}

export function depositNrc721Nft(payload: DepositNrc721Payload): Promise<Hash> {
  const toAddress = AppNrc721Config.bridgeAddress;

  return sendNrc721Nft({
    transformNftCell: (cell) => addNrc721BridgeExtraToNftCell(cell, payload.ethAddress),
    toAddress: toAddress,
    ...payload,
  });
}
