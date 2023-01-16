import { number, createFixedBytesCodec } from "@ckb-lumos/codec";

const { Uint8 } = number;

export const HashTypeCodec = createFixedBytesCodec<string>({
  byteLength: 1,
  pack: (type) => {
    if (type === "data") {
      return Uint8.pack(0);
    } else if (type === "type") {
      return Uint8.pack(1);
    } else if (type === "data1") {
      return Uint8.pack(2);
    } else {
      throw new Error(`invalid hash type: ${type}`);
    }
  },
  unpack: (buf) => {
    const data = Uint8.unpack(buf);
    if (data === 0) {
      return "data";
    } else if (data === 1) {
      return "type";
    } else if (data === 2) {
      return "data1";
    } else {
      throw new Error("invalid data");
    }
  },
});
