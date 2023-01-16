import { utils as ethersUtils, Wallet } from "ethers";
import { bytes, number } from "@ckb-lumos/codec";
import { blockchain, HexString } from "@ckb-lumos/base";
import { utils, helpers, Transaction } from "@ckb-lumos/lumos";
import { OmniLockWitnessLockCodec } from "@/modules/OmniLock/codec";

export async function signOmniLockTransactionSkeleton(txSkeleton: helpers.TransactionSkeletonType, signer: Wallet): Promise<Transaction> {
  const message = generateMessageByTransactionSkeleton(txSkeleton);
  const signedWitness = await signMessage(message, signer);

  txSkeleton = txSkeleton.update("witnesses", (witnesses) => witnesses.push(signedWitness));
  return helpers.createTransactionFromSkeleton(txSkeleton);
}

export function generateMessageByTransactionSkeleton(tx: helpers.TransactionSkeletonType): HexString {
  const transaction = helpers.createTransactionFromSkeleton(tx);
  return generateMessageByTransaction(transaction);
}

export function generateMessageByTransaction(transaction: Transaction): HexString {
  const hasher = new utils.CKBHasher();
  const rawTxHash = utils.ckbHash(blockchain.RawTransaction.pack(transaction).buffer);
  const serializedWitness = blockchain.WitnessArgs.pack({
    lock: bytes.bytify("0x" + "00".repeat(85)),
  });

  hasher.update(rawTxHash);
  hashWitness(hasher, serializedWitness);
  return hasher.digestHex();
}

export function hashWitness(hasher: utils.CKBHasher, witness: ArrayBuffer): void {
  const packedLength = number.Uint64LE.pack(witness.byteLength);
  hasher.update(packedLength.buffer);
  hasher.update(witness);
}

export async function signMessage(message: string, signer: Wallet): Promise<HexString> {
  let signedMessage = await signer.signMessage(ethersUtils.arrayify(message));

  let v = Number.parseInt(signedMessage.slice(-2), 16);
  if (v >= 27) v -= 27;

  signedMessage = "0x" + signedMessage.slice(2, -2) + v.toString(16).padStart(2, "0");
  return bytes.hexify(
    blockchain.WitnessArgs.pack({
      lock: OmniLockWitnessLockCodec.pack({
        signature: signedMessage
      }).buffer,
    }),
  );
}
