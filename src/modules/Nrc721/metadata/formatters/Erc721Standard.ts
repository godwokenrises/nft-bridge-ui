import { isObjectLike, get } from "lodash";
import { Nrc721MetadataBase } from "../types";

export function formatNrc721MetadataWithErc721Standard(target: unknown): Nrc721MetadataBase {
  if (!isObjectLike(target)) {
    throw new Error("Metadata should be an object");
  }

  const json = target as any;
  return ({
    name: get(json, "name"),
    image: get(json, "image"),
    description: get(json, "description"),
  });
}
