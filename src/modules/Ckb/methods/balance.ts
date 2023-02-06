import { helpers, BI, Indexer } from "@ckb-lumos/lumos";
import { Config } from "@ckb-lumos/config-manager";

export async function getCkbBalance(address: string, indexer: Indexer, lumosConfig: Config): Promise<BI> {
  let balance = BI.from(0);

  const pureCkbCollector = indexer.collector({
    lock: helpers.parseAddress(address, {
      config: lumosConfig,
    }),
    type: "empty",
    outputDataLenRange: ["0x0", "0x1"],
  });
  for await (const cell of pureCkbCollector.collect()) {
    balance = balance.add(cell.cellOutput.capacity);
  }

  return balance;
}
