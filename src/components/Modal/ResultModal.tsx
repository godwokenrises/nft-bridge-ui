import { ReactNode } from "react";
import { Icon } from "@ricons/utils";
import { Button } from "@mantine/core";
import { CheckRound, CloseRound } from "@ricons/material";
import { closeModal, openModal } from "@mantine/modals";
import classes from "classnames";

export interface SuccessModalProps {
  success?: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  buttons?: ReactNode;
  showClose?: boolean;
  close?: ReactNode;
  onClickClose?: () => any;
}

export function ResultModal(props: SuccessModalProps) {
  const showClose = props.showClose ?? true;
  const success = props.success ?? true;

  function onClickClose() {
    props.onClickClose?.();
  }

  return (
    <div>
      <div className={classes(
        "flex mx-auto mt-2 w-[80px] h-[80px] justify-center items-center rounded-full text-6xl",
        success ? "text-emerald-600 bg-emerald-100" : "text-red-400 bg-red-100"
      )}>
        <Icon>
          {success ? <CheckRound /> : <CloseRound />}
        </Icon>
      </div>

      {props.title && (
        <div className="mt-3 text-center font-semibold text-slate-900">
          {props.title}
        </div>
      )}
      {props.subtitle && (
        <div className="mt-0.5 text-xs text-center text-slate-500">
          {props.subtitle}
        </div>
      )}

      {props.children}

      {(props.buttons || showClose) && (
        <div className="mt-6">
          {props.buttons}
          {showClose && (
            <Button fullWidth radius="md" variant="default" onClick={onClickClose}>
              {props.close ?? "OK"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export interface DynamicResultModalProps extends SuccessModalProps {
  modalId: string;
}

export function openResultModal(props: DynamicResultModalProps) {
  openModal({
    modalId: props.modalId,
    withCloseButton: false,
    centered: true,
    radius: "lg",
    overlayBlur: 5,
    children: (
      <ResultModal
        {...props}
        onClickClose={() => closeModal(props.modalId)}
      />
    ),
  });
}
