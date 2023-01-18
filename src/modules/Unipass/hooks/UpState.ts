import { Address } from "@lay2/pw-core";
import { atom } from "jotai";

export const UpState = {
  // data
  username: atom<string | undefined>(void 0),
  l1Address: atom<Address | undefined>(void 0),
  // state
  connected: atom(false),
  connecting: atom(false),
  connectingId: atom<number | undefined>(void 0),
};
