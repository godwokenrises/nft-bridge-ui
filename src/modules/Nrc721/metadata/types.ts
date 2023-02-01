import { Nrc721NftData } from "../sdk";

export interface Nrc721MetadataBase {
  image?: string;
  name?: string;
  description?: string;
}

export type Nrc721RawMetadata = object | string;

export interface LoadNrc721Metadata {
  (nft: Nrc721NftData): Promise<Nrc721RawMetadata>;
}

export interface FormatNrc721Metadata {
  (target: unknown): Promise<Nrc721MetadataBase> | Nrc721MetadataBase;
}

