import { useMemo } from "react";
import { useQuery } from "react-query";
import { Address } from "@ckb-lumos/base";
import { Indexer } from "@ckb-lumos/lumos";
import { Config } from "@ckb-lumos/config-manager";
import { formatUnit } from "@ckb-lumos/bi";
import { getCkbBalance } from "@/modules/Ckb";

export interface UseCkbBalancePayload {
  address?: Address;
  indexer: Indexer;
  lumosConfig: Config;
}

export function useCkbBalance(payload: UseCkbBalancePayload) {
  const query = useQuery(
    ["CkbBalance", payload.address],
    () => {
      if (!payload.address) return void 0;
      return getCkbBalance(payload.address, payload.indexer, payload.lumosConfig);
    },
  );

  const balance = useMemo(() => query.data, [query.data]);
  const formattedBalance = useMemo(
    () => {
      if (!balance) return void 0;
      return formatUnit(balance!, "ckb");
    },
    [balance]
  );

  return {
    query,
    balance,
    formattedBalance,
    loading: query.isLoading,
    refetch: query.refetch,
  };
}
