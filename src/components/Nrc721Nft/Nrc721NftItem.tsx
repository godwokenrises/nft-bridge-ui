import classes from "classnames";
import { HTMLProps } from "react";
import { useQuery } from "react-query";
import { Loader, Tooltip } from "@mantine/core";
import { Icon } from "@ricons/utils";
import { MoreHorizRound } from "@ricons/material";
import { loadNrc721NftMetadata, Nrc721MetadataBase, Nrc721NftData } from "@/modules/Nrc721";
import { openNrc721NftDetailsModal } from "./Nrc721NftDetailsModal";
import { truncateMiddle } from "@/utils";

import { AppNrc721Config } from "@/constants/AppEnvironment";

export interface Nrc721NftItemProps {
  data: Nrc721NftData;
  disabled?: boolean;
  checked?: boolean;
}

export function Nrc721NftItem(props: Nrc721NftItemProps & Omit<HTMLProps<HTMLDivElement>, "data" | "activated">) {
  const shortenTokenId = truncateMiddle(props.data.tokenId, 4, 4);
  const queryMetadata = useQuery(
    ["Nrc721NftItemImage", JSON.stringify(props.data.rawCell)],
    () => loadNrc721NftMetadata(props.data, AppNrc721Config),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  const loading = queryMetadata.isLoading;
  const metadata = queryMetadata.data;

  function openDetailsModal() {
    if (!metadata) {
      return;
    }
    openNrc721NftDetailsModal({
      modalId: `Nrc721NftDetailsModal-${JSON.stringify(props.data.rawCell)}`,
      data: props.data,
      metadata: metadata,
    });
  }

  return (
    <div
      {...props}
      className={classes(
        "relative bg-white rounded-lg border border-slate-200",
        !props.disabled ? "cursor-pointer select-none" : void 0,
        props.checked ? "border-emerald-500" : void 0,
        props.checked && !props.disabled ? "ring-1 ring-emerald-500 hover:ring-emerald-600 hover:border-emerald-600" : "hover:border-slate-400",
      )}
    >
      <div className="pt-1 px-1 h-20">
        <Nrc721NftItemImage loading={loading} metadata={metadata} />
      </div>
      <div className="p-1">
        <div className="p-1 text-center rounded-md bg-slate-50">
          <div className="truncate text-sm text-slate-800">{props.data.factoryData.name}</div>
          <div className="truncate text-xs text-slate-600">{shortenTokenId}</div>
        </div>
      </div>
      {!loading && (
        <Tooltip withArrow position="top" label="NFT details">
          <div className="absolute right-2 top-2" onClick={(e) => e.stopPropagation()}>
            <div
              className={classes(
                "flex text-2xl md:text-xl bg-white rounded-md text-slate-500",
                "hover:text-slate-700 hover:bg-slate-50 hover:ring-1 hover:ring-emerald-500"
              )}
              onClick={openDetailsModal}
            >
              <Icon>
                <MoreHorizRound />
              </Icon>
            </div>
          </div>
        </Tooltip>
      )}
    </div>
  );
}

export interface Nrc721NftItemImageProps {
  metadata?: Nrc721MetadataBase;
  loading: boolean;
}

export function Nrc721NftItemImage(props: Nrc721NftItemImageProps) {
  const loading = props.loading;
  const metadata = props.metadata;

  return (
    <div className="w-full h-full">
      {loading && (
        <div className="h-full flex justify-center items-center text-emerald-500">
          <Loader size="sm" color="currentColor" />
        </div>
      )}
      {!loading && !metadata?.image && (
        <div className="py-3 h-full flex justify-center items-center text-center text-slate-500">
          NFT
        </div>
      )}
      {!loading && metadata?.image && (
        <img className="w-full h-full object-cover rounded-md" src={metadata.image} alt="" />
      )}
    </div>
  );
}
