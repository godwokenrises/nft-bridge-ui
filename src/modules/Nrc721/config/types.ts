import { Hash, HexString, Script } from "@ckb-lumos/base";

export interface Nrc721FactoryConfig {
  factoryTypeScript: Script;
  nftTypeScript: Script;
}

export interface Nrc721Config {
  bridgeAddress: HexString;
  nftScriptHashes: Hash[];
  configs: Nrc721FactoryConfig[];
}
