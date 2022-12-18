import { ContentCopyOutlined } from "@ricons/material";
import { IconButton } from "@/components/Button";
import { showNotification } from "@mantine/notifications";
import { forwardRef, useState } from "react";
import { copyText } from "text-copier";

export interface CopyButtonProps {
  title: string;
  text: string;
}

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>((props, ref) => {
  const [copying, setCopying] = useState(false);

  async function copy() {
    if (copying) return;
    setCopying(true);
    await copyText(props.text);

    setCopying(false);
    showNotification({
      color: "green",
      title: "Copied Success",
      message: `${props.title} has been copied to clipboard`,
    });
  }

  return (
    <IconButton
      className="text-emerald-500 hover:border-emerald-600 bg-white hover:bg-gray-50"
      icon={<ContentCopyOutlined />}
      disabled={copying}
      onClick={copy}
      ref={ref}
    />
  );
});
