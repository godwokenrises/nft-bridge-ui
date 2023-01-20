import { Button, ScrollArea } from "@mantine/core";
import { CopyTextButton } from "@/components/Button";
import { openResultModal } from "@/components/Modal";
import { truncateMiddle } from "@/utils";
import { ReactNode } from "react";

export interface TransactionResultModalProps {
  success?: boolean;
  modalId: string;
  txHash?: string;
  error?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  explorerUrl?: string;
  showOpenInExplorer?: boolean;
  onClose?: () => any;
}

export function openTransactionResultModal(props: TransactionResultModalProps) {
  const showOpenInExplorer = props.showOpenInExplorer ?? true;
  function openInExplorer() {
    if (props.explorerUrl && props.txHash) {
      window.open(`${props.explorerUrl}/${props.txHash}`, "_blank");
    }
  }

  openResultModal({
    success: props.success,
    modalId: props.modalId,
    title: props.title,
    subtitle: props.subtitle,
    onClose: props.onClose,
    children: (
      <div className="mt-3">
        {props.txHash && (
          <div className="flex flex-col justify-center items-center p-2 rounded-lg bg-slate-100">
            <div className="text-xs text-center text-slate-400">TxHash</div>
            <CopyTextButton className="text-xs text-center text-slate-500" title="TxHash" content={props.txHash}>
              {truncateMiddle(props.txHash, 11, 10)}
            </CopyTextButton>
          </div>
        )}
        {props.error && (
          <div className="rounded-lg bg-slate-100">
            <div className="px-2 py-2 text-xs text-center text-slate-400">Error Message</div>
            <ScrollArea.Autosize
              scrollbarSize={8}
              maxHeight={200}
              classNames={{
                root: "rounded-lg bg-slate-100",
                viewport: "px-2 pb-2 text-sm text-center text-slate-500",
              }}
            >
              {props.error}
            </ScrollArea.Autosize>
          </div>
        )}

        <div className="pt-3 flex justify-center">
          <div className="w-6 h-px bg-slate-300" />
        </div>
      </div>
    ),
    buttons: (
      <>
        {showOpenInExplorer && props.explorerUrl && (
          <Button fullWidth radius="md" variant="default" color="teal" className="mb-1" onClick={openInExplorer}>
            Open in explorer
          </Button>
        )}
      </>
    ),
  });
}
