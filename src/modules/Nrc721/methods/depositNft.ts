import { Hash, HexString } from "@ckb-lumos/base";
import { sendNrc721Nft, addNrc721BridgeExtraToNftCell, SendNrc721NftPayload } from "@/modules/Nrc721";

import { AppNrc721Config } from "@/constants/AppEnvironment";

export interface DepositNrc721Payload extends Omit<SendNrc721NftPayload, "toAddress"> {
  ethAddress: HexString;
}

export function depositNrc721Nft(payload: DepositNrc721Payload): Promise<Hash> {
  const toAddress = AppNrc721Config.bridgeAddress;

  return sendNrc721Nft({
    transformNftCell: (cell) => addNrc721BridgeExtraToNftCell(cell, payload.ethAddress),
    toAddress: toAddress,
    ...payload,
  });
}
