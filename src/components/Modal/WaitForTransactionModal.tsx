import { useQuery } from "react-query";
import { ReactNode, useEffect } from "react";
import { Button, Loader, Tooltip } from "@mantine/core";

export interface WaitForTransactionModalProps {
  fetch: () => Promise<boolean> | boolean;
  modalId?: string;
  interval?: number;
  close?: ReactNode;
  onClickClose?: () => any;
  onSuccess?: () => any;
}

export function WaitForTransactionModal(props: WaitForTransactionModalProps) {
  const queryTransaction = useQuery(
    ["WaitForTransaction", props.modalId],
    () => props.fetch(),
    {
      refetchInterval: props.interval ?? 2000,
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: false,
      cacheTime: 0,
    }
  );

  useEffect(() => {
    if (queryTransaction.data) {
      props.onSuccess?.();
    }
  }, [queryTransaction.isFetching]);

  return (
    <div>
      <div className="flex mx-auto w-[100px] h-[100px] justify-center items-center rounded-xl text-emerald-600">
        <Loader size="xl" color="currentColor" />
      </div>
      <div className="mt-1 text-center font-semibold text-slate-900">Waiting</div>
      <div className="mt-0.5 text-xs text-center text-slate-500">Please wait for the transaction to be completed</div>

      <Tooltip withArrow multiline width={220} position="bottom" label={<div className="text-center">Force to close the dialog</div>}>
        <Button fullWidth radius="md" variant="default" className="mt-6" onClick={() => props.onClickClose?.()}>
          {props.close ?? "Close"}
        </Button>
      </Tooltip>
    </div>
  );
}
