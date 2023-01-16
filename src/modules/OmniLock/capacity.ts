import { BI } from "@ckb-lumos/lumos";
import { Config } from "@ckb-lumos/config-manager";
import { minimalCellCapacityCompatible } from "@ckb-lumos/helpers";

export function minimalOmniLockPureCellCapacity(lumosConfig: Config): BI {
  const omni = lumosConfig.SCRIPTS.OMNILOCK!;
  return minimalCellCapacityCompatible({
    cellOutput: {
      capacity: "0x0",
      lock: {
        codeHash: omni.CODE_HASH,
        hashType: omni.HASH_TYPE,
        args: `0x01eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00`,
      },
    },
    data: "0x"
  });
}
