import UpCore from "up-core-test";
import UpCkb, { AssetLockProof, fetchAssetLockProof, completeTxWithProof } from "up-ckb-alpha-test";
import * as PwCore from "@lay2/pw-core";
import * as LumosBase from "@ckb-lumos/base";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { helpers } from "@ckb-lumos/lumos";
import { useAtomCallback } from "jotai/utils";
import { UpState } from "./UpState";
import { UPCoreSimpleProvider } from "@/modules/Unipass";
import { AppUnipassConfig } from "@/constants/AppEnvironment";
import { lumosTransactionSkeletonToPwRawTransaction } from "@/modules/PwLock";

export function useUnipassId() {
  const [username, setUsername] = useAtom(UpState.username);
  const [l1Address, setL1Address] = useAtom(UpState.l1Address);
  const [connected, setConnected] = useAtom(UpState.connected);
  const [connecting, setConnecting] = useAtom(UpState.connecting);
  const [_, setConnectingId] = useAtom(UpState.connectingId);

  const getConnectingId = useAtomCallback(
    useCallback((get) => get(UpState.connectingId), []),
  );

  function generateConnectingId() {
    const id = Math.round(Math.random() * 10 ** 2);
    setConnectingId(id);
    return id;
  }

  async function connect() {
    if (connecting) return;
    setConnecting(true);

    try {
      const id = generateConnectingId();
      const account = await UpCore.connect();
      if (await getConnectingId() === id) {
        console.log("Account:", account);
        setUsername(account.username);
        setConnected(true);

        const address = UpCkb.getCKBAddress(account.username);
        console.log("L1 UP-lock Address:", address);
        setL1Address(address);
      }
    } catch (e) {
      setUsername(void 0);
      setConnected(false);
    } finally {
      setConnecting(false);
      setConnectingId(void 0);
    }
  }

  function disconnect() {
    UpCore.disconnect();
    setUsername(void 0);
    setConnectingId(void 0);
    setConnected(false);
    setConnecting(false);
  }

  async function signTransactionSkeleton(txSkeleton: helpers.TransactionSkeletonType) {
    const provider = new UPCoreSimpleProvider(username!, AppUnipassConfig.ckb.upLockCodeHash);
    console.log("UPCoreSimpleProvider", provider);

    // Build PwCore.Transaction from LumosBase.TransactionSkeleton
    const rawTx = lumosTransactionSkeletonToPwRawTransaction(txSkeleton);
    const tx = new PwCore.Transaction(rawTx, [
      PwCore.Builder.WITNESS_ARGS.RawSecp256k1
    ]);

    // Backup cellDeps of the transaction, for it to be signed later
    const oldCellDeps = tx.raw.cellDeps;
    tx.raw.cellDeps = [];

    // Sign transaction
    const signer = new PwCore.DefaultSigner(provider);
    const signedTx = await signer.sign(tx);

    // Get AssetLockProof from UpCkb
    const usernameHash = provider.usernameHash;
    const assetLockProof: AssetLockProof = await fetchAssetLockProof(usernameHash);
    if (new PwCore.Reader(assetLockProof.lockInfo[0].userInfo).length() === 0) {
      throw new Error('user not registered');
    }

    console.log("assetLockProof.cellDep", [...assetLockProof.cellDeps]);
    console.log("oldCellDeps", [...oldCellDeps]);

    // Fill up transaction and transform to LumosBase.Transaction
    (assetLockProof as any).cellDeps = [...assetLockProof.cellDeps, ...oldCellDeps];
    const completedSignedTx = completeTxWithProof(signedTx, assetLockProof, usernameHash);
    console.log("assetLockProof", assetLockProof);
    console.log("completedSignedTx", completedSignedTx);
    const transformedTx = PwCore.transformers.TransformTransaction(completedSignedTx);

    return transformedTx as LumosBase.Transaction;
  }

  async function sendTransaction(tx: LumosBase.Transaction): Promise<LumosBase.Hash> {
    const rpc = new PwCore.RPC(AppUnipassConfig.ckb.ckbNodeUrl);
    return rpc.send_transaction(tx, "passthrough");
  }

  return {
    username,
    l1Address,
    connected,
    connecting,
    connect,
    disconnect,
    signTransactionSkeleton,
    sendTransaction,
  };
}
