import { get } from "lodash";
import { openModal } from "@mantine/modals";
import { Button, ModalProps, ScrollArea } from "@mantine/core";
import { Icon } from "@ricons/utils";
import { OpenInNewRound } from "@ricons/material";
import { Nrc721NftItemImage } from "./Nrc721NftItem";
import { Nrc721MetadataBase, Nrc721NftData } from "@/modules/Nrc721";

import { AppCkbExplorerUrl } from "@/constants/AppEnvironment";

export interface Nrc721NftDetailsModalProps {
  data: Nrc721NftData;
  metadata?: Nrc721MetadataBase;
}

export function Nrc721NftDetailsModal(props: Nrc721NftDetailsModalProps) {
  function openInExplorer() {
    if (props.data.rawCell.outPoint) {
      window.open(`${AppCkbExplorerUrl}/transaction/${props.data.rawCell.outPoint.txHash}`, "_blank");
    }
  }

  return (
    <ScrollArea
      scrollbarSize={8}
      className="flex-auto flex"
      classNames={{
        root: "border-t border-slate-200 flex-auto flex overflow-hidden",
        viewport: "scroll-area-viewport--full",
      }}
    >
      <div className="p-4">
        <div className="flex flex-col md:flex-row">
          <div className="mx-auto md:mx-0 w-2/3 md:w-1/3">
            <div className="pt-[100%] relative">
              <div className="absolute left-0 top-0 w-full h-full bg-slate-50 rounded-lg">
                <Nrc721NftItemImage loading={false} metadata={props.metadata} />
              </div>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:ml-5 flex-auto">
            {props.metadata && (props.metadata.name || props.metadata.description) && (
              <div className="mb-7 text-center md:text-left">
                {props.metadata.name && (
                  <div className="text-xl md:text-2xl">{props.metadata.name}</div>
                )}
                {props.metadata.description && (
                  <div className="mt-1 text-xs md:text-sm text-slate-500">{props.metadata.description}</div>
                )}
              </div>
            )}
            <div className="space-y-6">
              <div className="px-3 w-full relative rounded-lg border border-slate-200">
                <div className="absolute inline-block transform -translate-y-1/2 text-sm text-slate-400 bg-white">
                  Collection Details
                </div>
                <div className="pt-5 pb-4 space-y-3">
                  <div>
                    <div className="text-xs text-slate-500">Name</div>
                    <div className="text-sm leading-tight text-slate-800">{props.data.factoryData.name || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Symbol</div>
                    <div className="text-sm leading-tight text-slate-800">{props.data.factoryData.symbol || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Base Token URI</div>
                    <div className="text-sm leading-tight text-slate-800 break-all">{props.data.factoryData.baseTokenUri || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Extra Data</div>
                    <div className="text-sm leading-tight text-slate-800 break-all">{props.data.factoryData.extraData || "-"}</div>
                  </div>
                </div>
              </div>
              <div className="px-3 w-full relative rounded-lg border border-slate-200">
                <div className="absolute inline-block transform -translate-y-1/2 text-sm text-slate-400 bg-white">
                  Token Details
                </div>
                <div className="pt-5 pb-4 space-y-3">
                  <div>
                    <div className="text-xs text-slate-500">Token ID</div>
                    <div className="text-sm leading-tight text-slate-800 break-all">{props.data.tokenId}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Token Cell Tx-Hash</div>
                    <div className="text-sm leading-tight text-slate-800 break-all">{props.data.rawCell.outPoint?.txHash ?? "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Token Cell Index</div>
                    <div className="text-sm leading-tight text-slate-800 break-all">{props.data.rawCell.outPoint?.index ?? "-"}</div>
                  </div>
                  {props.data.rawCell.outPoint && (
                    <Button fullWidth variant="default" color="teal" radius="sm" size="sm" onClick={openInExplorer}>
                      <div className="inline-flex items-center">
                        <span className="mr-1">Open in explorer</span>
                        <Icon>
                          <OpenInNewRound />
                        </Icon>
                      </div>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export interface OpenNrc721NftDetailsModalProps extends Nrc721NftDetailsModalProps {
  modalId: string;
  classNames?: ModalProps["classNames"];
  styles?: ModalProps["styles"];
}

export function openNrc721NftDetailsModal(props: OpenNrc721NftDetailsModalProps) {
  openModal({
    modalId: props.modalId,
    overflow: "inside",
    centered: true,
    radius: "lg",
    overlayBlur: 5,
    size: 600,
    title: "NFT Details",
    classNames: {
      ...props.classNames,
      header: "px-4 py-3 !mb-0",
    },
    styles: {
      ...props.styles,
      modal: {
        padding: "0 !important",
        ...(get(props.styles, "modal") ?? {}),
      },
      body: {
        flex: "auto",
        display: "flex",
        ...(get(props.styles, "body") ?? {}),
      },
    },
    children: (
      <Nrc721NftDetailsModal {...props} />
    ),
  });
}
