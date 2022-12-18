import UpCore from "up-core-test";
import UpCkb from "up-ckb-alpha-test";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { useAtomCallback } from "jotai/utils";
import { UpState } from "./UpState";

export function useUnipassId() {
  const [username, setUsername] = useAtom(UpState.username);
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
        console.log("CKB Address:", address);
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

  return {
    username,
    connected,
    connecting,
    connect,
    disconnect,
  };
}
