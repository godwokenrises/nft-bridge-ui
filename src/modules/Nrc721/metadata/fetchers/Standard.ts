import { Nrc721NftData } from "../../sdk";

export async function fetchNrc721MetadataWithStandard(nft: Nrc721NftData) {
  const uri = nft.tokenUri;
  const response = await fetch(uri);
  const responseText = await response.text();

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}
