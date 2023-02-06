import { isEqual } from "lodash";
import { Cell } from "@ckb-lumos/base";
import { Config } from "@ckb-lumos/config-manager";
import { BI, helpers, Indexer } from "@ckb-lumos/lumos";

export interface CollectPaymentCellsPayload {
  address: string;
  neededCapacity: BI;
  indexer: Indexer;
  lumosConfig: Config;
  excludedCells?: Cell[];
}

export interface CollectPaymentCellsResult {
  cells: Cell[];
  capacity: BI;
}

export async function collectPaymentCells(payload: CollectPaymentCellsPayload): Promise<CollectPaymentCellsResult> {
  const excludedCells = payload.excludedCells ?? [];
  const collectedCells: Cell[] = [];
  let collectedCapacity = BI.from(0);

  const pureCkbCollector = payload.indexer.collector({
    lock: helpers.parseAddress(payload.address, {
      config: payload.lumosConfig,
    }),
    type: "empty",
    outputDataLenRange: ["0x0", "0x1"],
  });

  for await (const cell of pureCkbCollector.collect()) {
    const exists = excludedCells.findIndex((row) => isEqual(row, cell)) > -1;
    if (exists) {
      continue;
    }

    collectedCells.push(cell);
    collectedCapacity = collectedCapacity.add(cell.cellOutput.capacity);
    if (collectedCapacity.gte(payload.neededCapacity)) {
      break;
    }
  }

  return {
    cells: collectedCells,
    capacity: collectedCapacity,
  };
}
