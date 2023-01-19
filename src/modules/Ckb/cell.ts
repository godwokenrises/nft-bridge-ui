import { Indexer } from "@ckb-lumos/lumos";
import { Cell, Script } from "@ckb-lumos/base";

export async function getTypeIdCellByTypeScript(script: Script, indexer: Indexer): Promise<Cell> {
  const collector = indexer.collector({
    type: script,
  });

  const cells: Cell[] = [];
  for await (const cell of collector.collect()) {
    cells.push(cell);
    if (cells.length > 1) {
      throw new Error("Collected too many cells while finding the TypeID Script");
    }
  }

  if (!cells.length) {
    throw new Error("No TypeID Script found");
  }
  return cells[0];
}
