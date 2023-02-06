import { formatUnit } from "@ckb-lumos/bi";
import { EnsuredQueryKey } from "react-query/types/core/types";
import { QueryFunctionContext, QueryKey, useQuery } from "react-query";
import { Nrc721NftTransferResult } from "@/modules/Nrc721";

export interface UseNrc721TransferCheckoutPayload<TQueryKey extends QueryKey> {
  getter: (context: QueryFunctionContext<TQueryKey>) => Promise<Nrc721NftTransferResult | undefined> | Nrc721NftTransferResult | undefined;
  deps?: TQueryKey;
}

export function useNrc721TransferCheckout<TQueryKey extends QueryKey = QueryKey>(payload: UseNrc721TransferCheckoutPayload<TQueryKey>) {
  const deps: EnsuredQueryKey<TQueryKey> = (() => {
    if (Array.isArray(payload.deps)) return payload.deps;
    if (payload.deps !== void 0) return [payload.deps];
    return [];
  })() as EnsuredQueryKey<TQueryKey>;

  const query = useQuery(
    ["TransferNftFee", ...deps],
    async (context) => {
      const result = await payload.getter(context as any);
      if (result === void 0) return void 0;

      return {
        transactionFee: result.transactionFee,
        totalCostCapacity: result.totalCostCapacity,
        formattedTransactionFee: formatUnit(result.transactionFee, "ckb"),
        formattedTotalCostCapacity: formatUnit(result.totalCostCapacity, "ckb"),
      };
    },
    {
      cacheTime: 5000,
    }
  );

  return {
    query,
    ...query.data,
    loading: query.isLoading,
  };
}
