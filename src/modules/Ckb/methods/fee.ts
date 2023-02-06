import { BI, RPC } from "@ckb-lumos/lumos";
import { Transaction } from "@ckb-lumos/base";
import { getTransactionSize } from "./transaction";

export async function calculateTransactionFee(tx: Transaction, rpc: RPC | string) {
  rpc = typeof rpc === "string" ? new RPC(rpc) : rpc;
  const feeRate = await getCkbMinFeeRate(rpc);
  const ratio = BI.from("1000");
  const size = getTransactionSize(tx);

  const base = BI.from(size).mul(feeRate);
  const fee = base.div(ratio);
  if (fee.mul(ratio).lt(base)) {
    return fee.add(1);
  }
  return BI.from(fee);
}

export async function getCkbMinFeeRate(rpc: RPC) {
  const info = await rpc.txPoolInfo();
  return BI.from(info.minFeeRate);
}
