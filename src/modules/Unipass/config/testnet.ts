import { ChainID } from "@lay2/pw-core";
import { UnipassConfig } from "@/modules/Unipass/config/types";

export const TestnetUnipassConfig: UnipassConfig = {
  core: {
    domain: "t.app.unipass.id",
    protocol: "https",
  },
  ckb: {
    chainID: ChainID.ckb_testnet,
    ckbNodeUrl: "https://testnet.ckb.dev",
    ckbIndexerUrl: "https://testnet.ckb.dev/indexer",
    upSnapshotUrl: "https://t.aggregator.unipass.id/dev/snapshot/",
    upLockCodeHash: "0x3e1eb7ed4809b2d60650be96a40abfbdafb3fb942b7b37ec7709e64e2cd0a783",
  },
};
