import * as PwCore from "@lay2/pw-core";
import * as LumosBase from "@ckb-lumos/base";
import { helpers } from "@ckb-lumos/lumos";
import { snakeCase } from "lodash";

export function lumosCellToPwCell(cell: LumosBase.Cell): PwCore.Cell {
  return new PwCore.Cell(
    new PwCore.Amount(cell.cellOutput.capacity, PwCore.AmountUnit.shannon),
    lumosScriptToPwScript(cell.cellOutput.lock),
    cell.cellOutput.type ? lumosScriptToPwScript(cell.cellOutput.type) : void 0,
    cell.outPoint ? lumosOutPointToPwOutPoint(cell.outPoint) : void 0,
    cell.data,
  );
}

export function lumosScriptToPwScript(script: LumosBase.Script): PwCore.Script {
  return new PwCore.Script(
    script.codeHash,
    script.args,
    script.hashType as PwCore.HashType,
  );
}

export function lumosOutPointToPwOutPoint(outPoint: LumosBase.OutPoint): PwCore.OutPoint {
  return new PwCore.OutPoint(
    outPoint.txHash,
    outPoint.index,
  );
}

export function lumosCellDepToPwCellDep(cellDep: LumosBase.CellDep): PwCore.CellDep {
  return new PwCore.CellDep(
    snakeCase(cellDep.depType) as PwCore.DepType,
    lumosOutPointToPwOutPoint(cellDep.outPoint),
  );
}

export function lumosTransactionSkeletonToPwRawTransaction(txSkeleton: helpers.TransactionSkeletonType) {
  return new PwCore.RawTransaction(
    txSkeleton.inputs.toArray().map(lumosCellToPwCell),
    txSkeleton.outputs.toArray().map(lumosCellToPwCell),
    txSkeleton.cellDeps.toArray().map(lumosCellDepToPwCellDep),
    txSkeleton.headerDeps.toArray(),
  );
}
