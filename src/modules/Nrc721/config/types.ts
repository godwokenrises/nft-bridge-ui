import { Hash, HexString, Script } from "@ckb-lumos/base";

export interface Nrc721NftScriptConfig {
  typeScriptHash: Hash;
  typeScript: Script;
}

export interface Nrc721FactoryConfig {
  factoryTypeScript: Script;
}

export interface Nrc721Config {
  bridgeAddress: HexString;
  nftScripts: Nrc721NftScriptConfig[];
  factories: Nrc721FactoryConfig[];
}
