import { Transaction, blockchain } from "@ckb-lumos/base";
import { helpers } from "@ckb-lumos/lumos";

// Why add 4 to the size while calculating the size of a transaction
// https://github.com/nervosnetwork/ckb/wiki/Transaction-%C2%BB-Transaction-Fee#calculate-transaction-fee
export function getTransactionSize(tx: Transaction): number {
  const serializedTx = blockchain.Transaction.pack(tx);
  return 4 + serializedTx.buffer.byteLength;
}

export function getTransactionSkeletonSize(txSkeleton: helpers.TransactionSkeletonType): number {
  const tx = helpers.createTransactionFromSkeleton(txSkeleton);
  return getTransactionSize(tx);
}
