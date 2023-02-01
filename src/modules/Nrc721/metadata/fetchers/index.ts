import { fetchNrc721MetadataWithStandard } from "./Standard";
import { LoadNrc721Metadata } from "../types";

export enum Nrc721MetadataFetcher {
  Standard,
}

export const Nrc721MetadataFetchers: Record<Nrc721MetadataFetcher, LoadNrc721Metadata> = {
  [Nrc721MetadataFetcher.Standard]: fetchNrc721MetadataWithStandard,
};
