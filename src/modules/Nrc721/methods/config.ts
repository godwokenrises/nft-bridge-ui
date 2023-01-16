import { isEqual } from "lodash";
import { bytes } from "@ckb-lumos/codec";
import { HashType, Script } from "@ckb-lumos/base";
import { Nrc721Config, Nrc721NftData } from "@/modules/Nrc721";
import { Nrc721NftCellArgsCodec } from "@/modules/Nrc721/codec";

export function findNrc721ConfigFromNftData(nft: Nrc721NftData, config: Nrc721Config) {
  const nftType = nft.rawCell.type!;
  const nftArgs = Nrc721NftCellArgsCodec.unpack(bytes.bytify(nftType.args));
  const factoryScript: Script = {
    codeHash: nftArgs.factoryCodeHash,
    hashType: nftArgs.factoryHashType as HashType,
    args: nftArgs.factoryArgs,
  };

  return config.configs.find((row) => {
    return isEqual(factoryScript, row.factoryTypeScript);
  });
}
