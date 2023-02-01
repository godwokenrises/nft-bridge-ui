import { isEqual } from "lodash";
import { bytes } from "@ckb-lumos/codec";
import { HashType, Script } from "@ckb-lumos/base";
import { Nrc721Config, Nrc721FactoryConfig, Nrc721NftScriptConfig } from "../config";
import { Nrc721NftData } from "../sdk";
import { Nrc721NftCellArgsCodec } from "../codec";

export function findNrc721FactoryConfigByNftData(nft: Nrc721NftData, config: Nrc721Config): Nrc721FactoryConfig | undefined {
  const nftType = nft.rawCell.type!;
  const nftArgs = Nrc721NftCellArgsCodec.unpack(bytes.bytify(nftType.args));
  const factoryScript: Script = {
    codeHash: nftArgs.factoryCodeHash,
    hashType: nftArgs.factoryHashType as HashType,
    args: nftArgs.factoryArgs,
  };

  return config.factories.find((row) => {
    return isEqual(factoryScript, row.factoryTypeScript);
  });
}

export function findNrc721NftScriptConfigByNftData(nft: Nrc721NftData, config: Nrc721Config): Nrc721NftScriptConfig | undefined {
  const nftType = nft.rawCell.type!;
  return config.nftScripts.find((script => {
    return script.typeScriptHash === nftType.codeHash;
  }));
}
