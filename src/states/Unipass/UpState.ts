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

UpCkb.config({
  chainID: ChainID.ckb_testnet,
  ckbNodeUrl: "https://testnet.ckb.dev",
  ckbIndexerUrl: "https://testnet.ckb.dev/indexer",
  upSnapshotUrl: "https://d.aggregator.unipass.id/dev/snapshot/",
  upLockCodeHash: "0xd41445a4845a09c163d174f59644877465710031582f640ba2e11437b005b812",
});
