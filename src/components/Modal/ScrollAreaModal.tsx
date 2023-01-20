import { Modal, ModalProps, ScrollArea } from "@mantine/core";
import classes from "classnames";

export interface ScrollAreaModalProps {
  onClose?: () => void;
}

export function ScrollAreaModal(props: ScrollAreaModalProps & Omit<ModalProps, "onClose">) {
  console.log("ScrollAreaModal", props.opened);
  return (
    <Modal
      centered
      overflow="inside"
      size={props.size ?? 400}
      radius={props.radius ?? "lg"}
      overlayBlur={props.overlayBlur ?? 5}
      onClose={props.onClose ?? (() => {})}
      classNames={{
        modal: classes("p-0!", props.classNames?.modal),
        body: classes("flex-auto flex", props.classNames?.body),
        ...props.classNames,
      }}
      {...props}
    >
      <ScrollArea
        scrollbarSize={8}
        className="flex-auto flex"
        classNames={{
          root: "flex-auto flex overflow-hidden",
          viewport: "scroll-area-viewport--full",
        }}
      >
        {props.children}
      </ScrollArea>
    </Modal>
  );
}
