import { ReactNode, useEffect } from "react";
import { Loader } from "@mantine/core";
import { useQuery } from "react-query";
import { Nrc721NftItem } from "@/components/Nrc721Nft";
import { getSupportedNrc721NftList, Nrc721NftData } from "@/modules/Nrc721";
import { differenceBy } from "lodash";

export interface Nrc721NftListProps {
  address: string;
  disabled?: boolean;
  max?: number;
  empty?: ReactNode;
  selected?: Nrc721NftData[];
  onClickItem?: (row: Nrc721NftData, selected: boolean) => any;
  isItemSelected?: (row: Nrc721NftData, selected: Nrc721NftData[]) => boolean;
  onMissingSelected?: (list: Nrc721NftData[]) => any;
}

export function Nrc721NftList(props: Nrc721NftListProps) {
  const max = props.max ?? 1;
  const selected = props.selected ?? [];
  const hasAnySelected = selected.length > 0;
  const clickable = !props.disabled && Array.isArray(props.selected) && selected.length < max;
  if ((clickable || hasAnySelected) && !(props.isItemSelected instanceof Function)) {
    throw new Error("`isItemActivated` must be set if Nrc721NftList is selectable");
  }

  const queryNftList = useQuery(
    ["Nrc721NftList", props.address],
    () => getSupportedNrc721NftList(props.address),
    {
      cacheTime: 0,
      refetchInterval: 60000,
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: false,
    }
  );

  const nfts = queryNftList.data;
  const isEmpty = !(nfts?.length ?? 0);
  const loading = queryNftList.isLoading;

  useEffect(() => {
    if (props.onMissingSelected && !queryNftList.isLoading && selected?.length) {
      const missing = differenceBy(selected, nfts ?? []);
      if (missing.length) {
        props.onMissingSelected(missing);
      }
    }
  }, [queryNftList.isLoading, props.onMissingSelected]);

  function onClickItem(row: Nrc721NftData) {
    if (!props.disabled && Array.isArray(props.selected) && props.isItemSelected) {
      const checked = props.isItemSelected(row, props.selected);
      props.onClickItem?.(row, checked);
    }
  }

  return (
    <div>
      {loading && (
        <div className="py-7 flex justify-center items-center text-emerald-500">
          <Loader size="sm" color="currentColor" />
        </div>
      )}
      {!loading && !isEmpty && (
        <div className="grid grid grid-cols-2 md:grid-cols-3 gap-2">
          {nfts?.map((nft, index) => (
            <Nrc721NftItem
              data={nft} key={index}
              disabled={props.disabled}
              checked={props.isItemSelected ? props.isItemSelected(nft, props.selected!) : void 0}
              onClick={() => onClickItem(nft)}
            />
          ))}
        </div>
      )}
      {!loading && isEmpty && props.empty}
    </div>
  );
}
