import { Hash, HexString, Script } from "@ckb-lumos/base";
import { Nrc721MetadataFetcher } from "../metadata/fetchers";
import { Nrc721MetadataFormatter } from "../metadata/formatters";

export interface Nrc721NftScriptConfig {
  typeScriptHash: Hash;
  typeScript: Script;
}

export interface Nrc721FactoryConfig {
  factoryTypeScript: Script;
  loader?: Nrc721MetadataFetcher;
  formatter?: Nrc721MetadataFormatter;
}

export interface Nrc721Config {
  bridgeAddress: HexString;
  nftScripts: Nrc721NftScriptConfig[];
  factories: Nrc721FactoryConfig[];
}
