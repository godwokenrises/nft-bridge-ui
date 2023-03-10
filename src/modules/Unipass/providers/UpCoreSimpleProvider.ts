import UPCore, { UPAuthMessage, UPAuthResponse } from "up-core-test";
import { UPCKBBaseProvider } from "up-ckb-alpha-test";
import { Reader } from "@lay2/pw-core";

export class UPCoreSimpleProvider extends UPCKBBaseProvider {
  async authorize(message: string): Promise<UPAuthResponse> {
    console.log("before signed message: ", message);

    // call up-core to get sig
    const { keyType, pubkey, sig: sigHex } = await UPCore.authorize(
      new UPAuthMessage("CKB_TX", this.username, message),
    );

    let sig: string = sigHex;
    if (keyType === "Secp256k1Pubkey") {
      let v = Number.parseInt(sigHex.slice(-2), 16);
      if (v >= 27) v -= 27;
      sig = new Reader(
        sigHex.slice(0, -2) + v.toString(16).padStart(2, "0"),
      ).serializeJson();
    }

    console.log("UPCoreSimpleProvider signing", {
      keyType,
      pubkey,
      sig
    });

    // convert to hex string
    return {
      keyType,
      pubkey,
      sig
    };
  }
}
