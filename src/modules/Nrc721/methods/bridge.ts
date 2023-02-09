import { Buffer } from "buffer";
import { BI, utils } from "@ckb-lumos/lumos";
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

export function getL2Nrc721TokenId(nftCellTypeArgs: HexString) {
  const hasher = new utils.CKBHasher();
  hasher.update(nftCellTypeArgs);

  const tokenId = hasher.digestHex().slice(0, 42);
  return BI.from(tokenId);
}

// console.log("getL2Nrc721TokenId", getL2Nrc721TokenId("0x00000000000000000000000000000000000000000000000000545950455f494401b0d569a664c17a6101b6b8af81ff98f781d87b0a7b016c0107d617bc022b42f7ae47fa2a9235408928eae5df1c6866f6adbc46cf63a8ca09be5481d1b72ef647").toString());
