import { ChainID } from "@lay2/pw-core";

export interface UnipassConfig {
  core: {
    domain: string;
    protocol: 'https' | 'http';
  };
  ckb: {
    chainID: ChainID;
    ckbNodeUrl: string;
    ckbIndexerUrl: string;
    upSnapshotUrl: string;
    upLockCodeHash: string;
  };
}
