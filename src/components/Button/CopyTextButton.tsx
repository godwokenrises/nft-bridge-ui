import classes from "classnames";
import { Icon } from "@ricons/utils";
import { ContentCopyOutlined } from "@ricons/material";
import { forwardRef, HTMLProps, PropsWithChildren, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { copyText } from "text-copier";
import { omit } from "lodash";

export interface CopyTextButtonProps {
  title: string;
  content?: string;
  disabled?: boolean;
}

export const CopyTextButton = forwardRef<HTMLDivElement, PropsWithChildren<CopyTextButtonProps & HTMLProps<HTMLDivElement>>>((props, ref) => {
  const [copying, setCopying] = useState(false);
  async function copy() {
    if (copying || !props.content || props.disabled) return;
    setCopying(true);

    await copyText(props.content);

    setCopying(false);
    showNotification({
      color: "green",
      title: "Copied Success",
      message: `${props.title} has been copied to clipboard`,
    });
  }

  if (!props.content || props.disabled) {
    return (
      <div {...omit(props, ["title"])} ref={ref}>
        {props.children}
      </div>
    );
  }

  return (
    <div
      {...omit(props, ["title"])}
      ref={ref}
      onClick={copy}
      className={classes(
        "inline-flex items-center select-none cursor-pointer hover:opacity-70",
        props.className
      )}
    >
      <div>{props.children}</div>
      <div className="ml-1 inline-flex items-center">
        <Icon>
          <ContentCopyOutlined />
        </Icon>
      </div>
    </div>
  );
});
