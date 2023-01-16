import { Script } from "@ckb-lumos/base";
import { Config } from "@ckb-lumos/config-manager";
import { encodeToAddress } from "@ckb-lumos/helpers";

export function generateOmniLockScript(ethAddress: string, lumosConfig: Config): Script {
  return {
    codeHash: lumosConfig.SCRIPTS.OMNILOCK!.CODE_HASH,
    hashType: lumosConfig.SCRIPTS.OMNILOCK!.HASH_TYPE,
    // omni flag       pubkey hash   omni lock flags
    // chain identity   eth addr      function flag()
    // 00: Nervos       👇            00: owner
    // 01: Ethereum     👇            01: administrator
    //      👇          👇            👇
    args: `0x01${ethAddress.substring(2)}00`,
  };
}

export function generateOmniLockAddress(ethAddress: string, lumosConfig: Config): string {
  const script = generateOmniLockScript(ethAddress, lumosConfig);
  return encodeToAddress(script, {
    config: lumosConfig,
  });
}
