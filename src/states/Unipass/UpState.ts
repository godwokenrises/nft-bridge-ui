import { ChainID, Address } from "@lay2/pw-core";
import { atom } from "jotai";
import UpCore from "up-core-test";
import UpCkb from "up-ckb-alpha-test";

export const UpState = {
  // data
  username: atom<string | undefined>(void 0),
  l1Address: atom<Address | undefined>(void 0),
  // state
  connected: atom(false),
  connecting: atom(false),
  connectingId: atom<number | undefined>(void 0),
};

UpCore.config({
  domain: "t.app.unipass.id",
  protocol: "https",
});

// testnet
export const UpLockCodeHash = "0x3e1eb7ed4809b2d60650be96a40abfbdafb3fb942b7b37ec7709e64e2cd0a783";
UpCkb.config({
  chainID: ChainID.ckb_testnet,
  ckbNodeUrl: "https://testnet.ckb.dev",
  ckbIndexerUrl: "https://testnet.ckb.dev/indexer",
  upSnapshotUrl: "https://t.aggregator.unipass.id/dev/snapshot/",
  upLockCodeHash: UpLockCodeHash,
});
