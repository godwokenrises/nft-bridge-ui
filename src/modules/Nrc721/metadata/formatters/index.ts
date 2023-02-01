import { formatNrc721MetadataWithErc721Standard } from "./Erc721Standard";
import { FormatNrc721Metadata } from "../types";

export enum Nrc721MetadataFormatter {
  Erc721Standard,
}

export const Nrc721MetadataFormatters: Record<Nrc721MetadataFormatter, FormatNrc721Metadata> = {
  [Nrc721MetadataFormatter.Erc721Standard]: formatNrc721MetadataWithErc721Standard,
};
