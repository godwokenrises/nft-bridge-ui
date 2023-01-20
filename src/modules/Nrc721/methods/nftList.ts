import { helpers } from "@ckb-lumos/lumos";
import { HexString } from "@ckb-lumos/base";
import { Nrc721NftData, Nrc721Sdk } from "@/modules/Nrc721";

import { AppLumosConfig, AppNrc721Config } from "@/constants/AppEnvironment";
import { AppCkbIndexer, AppCkbIndexerUrl, AppCkbRpcUrl } from "@/constants/AppEnvironment";

export async function getSupportedNrc721NftList(address: HexString) {
  const Nrc721Service = await Nrc721Sdk.initialize({
    indexerUrl: AppCkbIndexerUrl,
    nodeUrl: AppCkbRpcUrl,
  });

  const lock = helpers.parseAddress(address, {
    config: AppLumosConfig,
  });

  const nftScripts = AppNrc721Config.nftScripts;
  function collect(nftScriptCodeHash: string) {
    const collector = AppCkbIndexer.collector({
      lock,
      type: {
        codeHash: nftScriptCodeHash,
        hashType: "type",
        args: "0x",
      },
    });

    return collector.collect();
  }

  const cells: Nrc721NftData[] = [];
  for (const scriptConfig of nftScripts) {
    for await (const cell of collect(scriptConfig.typeScriptHash)) {
      const type = cell.cellOutput.type;
      if (type && await Nrc721Service.nftCell.isCellNRC721(type)) {
        const data: Nrc721NftData = await Nrc721Service.nftCell.read(type);
        cells.push(data);
      }
    }
  }

  console.log("nrc721 cells:", cells);
  return cells;
}
