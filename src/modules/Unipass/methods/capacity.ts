import { BI } from "@ckb-lumos/lumos";
import { UnipassConfig } from "@/modules/Unipass";
import { minimalCellCapacityCompatible } from "@ckb-lumos/helpers";

export function minimalUnipassLockPureCellCapacity(unipassConfig: UnipassConfig): BI {
  return minimalCellCapacityCompatible({
    cellOutput: {
      capacity: "0x0",
      lock: {
        codeHash: unipassConfig.ckb.upLockCodeHash,
        hashType: "type",
        args: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
    },
    data: "0x"
  });
}
