import { Nrc721NftData } from "@/modules/Nrc721";
import { truncateMiddle } from "@/utils";
import { HTMLProps } from "react";
import classes from "classnames";

export interface Nrc721NftItemProps {
  data: Nrc721NftData;
  disabled?: boolean;
  checked?: boolean;
}

export function Nrc721NftItem(props: Nrc721NftItemProps & Omit<HTMLProps<HTMLDivElement>, "data" | "activated">) {
  const shortenTokenId = truncateMiddle(props.data.tokenId, 4, 4);

  return (
    <div
      {...props}
      className={classes(
        "bg-white rounded-lg border border-slate-200",
        !props.disabled ? "cursor-pointer select-none" : void 0,
        props.checked ? "border-emerald-500" : void 0,
        props.checked && !props.disabled ? "ring-1 ring-emerald-500 hover:ring-emerald-600 hover:border-emerald-600" : "hover:border-slate-400",
      )}
    >
      <div className="py-3 text-center text-slate-500">NFT</div>
      <div className="p-1">
        <div className="p-1 text-center rounded-md bg-slate-50">
          <div className="truncate text-sm text-slate-800">{props.data.factoryData.name}</div>
          <div className="truncate text-xs text-slate-600">{shortenTokenId}</div>
        </div>
      </div>
    </div>
  );
}
