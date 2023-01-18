import UpCore from "up-core-test";
import UpCkb from "up-ckb-alpha-test";
import { Indexer } from "@ckb-lumos/lumos";
import { TestnetLumosConfig } from "@/constants/LumosConfig";
import { TestnetNrc721Config } from "@/modules/Nrc721/config";
import { TestnetUnipassConfig } from "@/modules/Unipass";

// configs
export const AppLumosConfig = TestnetLumosConfig;
export const AppNrc721Config = TestnetNrc721Config;
export const AppUnipassConfig = TestnetUnipassConfig;

// single config fields
export const AppCkbRpcUrl = "https://testnet.ckb.dev";
export const AppCkbIndexerUrl = "https://testnet.ckb.dev/indexer";
export const AppCkbExplorerUrl = "https://pudge.explorer.nervos.org";

// instances
export const AppCkbIndexer = new Indexer(AppCkbRpcUrl, AppCkbIndexerUrl);

// initialize Unipass SDK
UpCore.config(AppUnipassConfig.core);
UpCkb.config(TestnetUnipassConfig.ckb);


