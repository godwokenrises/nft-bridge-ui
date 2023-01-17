import { Buffer } from "buffer";
import { utils } from "@ckb-lumos/lumos";
import { Hash, Cell, HexString } from "@ckb-lumos/base";
import { cloneDeep } from "lodash";

export function generateNrc721BridgeHeader(): Hash {
  const header = Buffer.from("GODWOKEN-NFT-BRIDGE-TARGET-ADDRESS", "utf-8");
  const hasher = new utils.CKBHasher();
  hasher.update(header);

  return hasher.digestHex().slice(0, 10);
}

// When transferring a nftCell to NftBridge target address, we need to add extra data in nftCell.data,
// so then NftBridge collector can identify the nftCell correctly.
// Transform: nftCell.data => nftCell.data + bridge header + eth address
export function addNrc721BridgeExtraToNftCell(nftCell: Cell, ethAddress: HexString): Cell {
  const cell = cloneDeep(nftCell);
  const header = generateNrc721BridgeHeader();

  cell.data = `${cell.data}${header.slice(2)}${ethAddress.slice(2)}`;
  return cell;
}
