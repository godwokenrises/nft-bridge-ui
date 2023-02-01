import { createObjectCodec, enhancePack } from "@ckb-lumos/codec";
import { blockchain } from "@ckb-lumos/base";
import { HashTypeCodec } from "./HashType";

const { Byte32 } = blockchain;

const RawNrc721NftCellArgsCodec = createObjectCodec({
  factoryCodeHash: Byte32,
  factoryHashType: HashTypeCodec,
  factoryArgs: Byte32,
  tokenId: Byte32,
});

export const Nrc721NftCellArgsCodec = enhancePack(
  RawNrc721NftCellArgsCodec,
  () => new Uint8Array(0),
  (buf: Uint8Array) => {
    return {
      factoryCodeHash: buf.slice(0, 32),
      factoryHashType: buf.slice(32, 33),
      factoryArgs: buf.slice(33, 65),
      tokenId: buf.slice(65, 97),
    };
  },
);
