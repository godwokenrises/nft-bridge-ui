import { Nrc721MetadataFormatter, Nrc721MetadataFormatters } from "./formatters";
import { Nrc721MetadataFetcher, Nrc721MetadataFetchers } from "./fetchers";
import { findNrc721FactoryConfigByNftData } from "../methods";
import { Nrc721Config } from "../config";
import { Nrc721NftData } from "../sdk";

export async function loadNrc721NftMetadata(nft: Nrc721NftData, config: Nrc721Config) {
  const factoryConfig = findNrc721FactoryConfigByNftData(nft, config);
  const raw = await fetchNrc721NftMetadata(nft, factoryConfig?.loader);
  return await formatNrc721Metadata(raw, factoryConfig?.formatter);
}

export async function fetchNrc721NftMetadata(nft: Nrc721NftData, loader?: Nrc721MetadataFetcher) {
  if (loader !== void 0) {
    if (!Nrc721MetadataFetchers[loader]) {
      throw new Error(`Nrc721MetadataFetcher "${loader}" not found`);
    }
    return await Nrc721MetadataFetchers[loader](nft);
  }

  for (const method of Object.values(Nrc721MetadataFetchers)) {
    try {
      return await method(nft);
    } catch(e) {
      // console.error("Failed to fetch Nrc721Metadata", e);
    }
  }

  throw new Error("Failed to fetch Nrc721Metadata with built-in methods");
}

export async function formatNrc721Metadata(rawMetadata: unknown, formatter?: Nrc721MetadataFormatter) {
  if (formatter !== void 0) {
    if (!Nrc721MetadataFormatters[formatter]) {
      throw new Error(`Nrc721MetadataFormatter "${formatter}" not found`);
    }
    const result = Nrc721MetadataFormatters[formatter](rawMetadata);
    return result instanceof Promise ? await result : result;
  }

  for (const method of Object.values(Nrc721MetadataFormatters)) {
    try {
      const result = method(rawMetadata);
      return result instanceof Promise ? await result : result;
    } catch(e) {
      // console.error("Failed to format Nrc721Metadata", e);
    }
  }

  throw new Error("Failed to format Nrc721Metadata with built-in methods");
}
