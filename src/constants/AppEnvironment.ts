import { Indexer } from "@ckb-lumos/lumos";
import { TestnetLumosConfig } from "@/constants/LumosConfig";
import { TestnetNrc721Config } from "@/modules/Nrc721/config";

export const AppLumosConfig = TestnetLumosConfig;
export const AppNrc721Config = TestnetNrc721Config;

export const AppCkbRpcUrl = "https://testnet.ckb.dev";
export const AppCkbIndexerUrl = "https://testnet.ckb.dev/indexer";
export const AppCkbIndexer = new Indexer(AppCkbRpcUrl, AppCkbIndexerUrl);


