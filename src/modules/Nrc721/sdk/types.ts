import CKB from "@nervosnetwork/ckb-sdk-core";
import { Cell, CellDep, Hash, HexNumber, RawTransaction, Script, Input, HexString } from "@ckb-lumos/base";
import { OutPoint } from "@ckb-lumos/base/lib/api";

export interface Nrc721SdkRoot {
  initialize: (params: { nodeUrl: string, indexerUrl: string }) => Nrc721SdkInstance;
}

export interface Nrc721SdkInstance {
  factoryCell: Nrc721SdkFactoryCellProperties;
  nftCell: Nrc721NftCellProperties;
  utils: Nrc721UtilsProperties;
  ckb: CKB;
}

export interface Nrc721SdkFactoryCellProperties {
  mint: Nrc721SdkFactoryUpdate;
  update: Nrc721SdkFactoryUpdate;
  readOne: (typeScript: Script, options?: { unsafe?: boolean }) => Promise<Nrc721FactoryData>;
  isCellNRC721: (typeScript: Script) => Promise<boolean>;
  CONSTANTS: {
    TYPE_CODE_HASH_SIZE: number,
    TYPE_ARGS_SIZE: number,
    FACTORY_HEADER: string,
  };
}

export interface Nrc721SdkFactoryUpdate {
  (params: {
    name?: string,
    symbol?: string,
    baseTokenUri?: string,
    sourceAddress: string,
    targetAddress?: string,
    factoryTypeScript: Script,
    fee?: number,
    factoryContractTypeScript?: Script,
    factoryContractDep?: CellDep,
    extraDeps?: CellDep[],
    extraData?: Buffer,
  }): Promise<{
    rawTransaction: RawTransaction,
    typeScript: Script,
    usedCapacity: number,
    inputCells: Cell[],
  }>;
}

export interface Nrc721NftCellProperties {
  getAllFactoryNftsByAdress: (params: {
    userAdress: string,
    factoryTypeScript: Script,
  }) => Promise<Cell[]>;
  createNewTypeScript: (params: {
    rawTransaction: RawTransaction,
    factoryTypeScript: Script,
    nftTypeCodeHash: Hash,
    outputIndex: HexNumber,
  }) => Promise<Script>;
  isCellNRC721: (typeScript: Script) => Promise<boolean>;
  mint: (params: {
    nftContractTypeScript: Script,
    factoryTypeScript: Script,
    sourceAddress: string,
    targetAddress: string,
    nftContractDep?: CellDep,
    extraDeps?: CellDep[],
    fee?: number,
    data?: object,
  }) => Promise<{
    rawTransaction: RawTransaction,
    nftTypeScript: Script,
    usedCapacity: number,
    inputCells: Cell[],
  }>;
  read: (typeScript: Script) => Promise<Nrc721NftData>;
  CONSTANTS: {
    TOKEN_HEADER: string;
  };
}

export interface Nrc721UtilsProperties {
  getCellOccupiedCapacity: (cell: Cell, cellData: string) => number;
  bigNumberCKBToShannon: (amount: bigint | boolean | number | string) => bigint;
  serializeInputCell: (inputCell: Input) => Buffer;
  getPaymentCells: (params: {
    amountCKB: number | string,
    cells: Cell[],
  }) => {
    inputs: Input[],
    changeCell: Cell,
  };
  hxShannonToCKB: (hex: HexNumber) => number;
  scriptToBuffer: (script: Script) => Buffer;
  CKBToShannon: (amount: number) => bigint;
  shannonToCKB: (amount: number | bigint) => number;
  hexToBytes: (hex: HexString) => number[];
}

export interface Nrc721FactoryData {
  baseTokenUri: string;
  extraData: string;
  name: string;
  symbol: string;
}

export interface Nrc721NftData {
  rawCell: RawCell;
  data: string;
  tokenId: string;
  tokenUri: string;
  factoryData: Nrc721FactoryData;
}

export interface RawCell {
  capacity: HexNumber;
  lock: Script;
  type?: Script;
  data: HexString;
  outPoint?: OutPoint;
  blockHash?: Hash;
  blockNumber?: HexNumber;
}
