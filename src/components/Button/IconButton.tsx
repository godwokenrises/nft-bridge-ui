import { ButtonHTMLAttributes, forwardRef, ReactNode, useMemo } from "react";
import { Icon } from "@ricons/utils";
import { omit } from "lodash";
import classes from "classnames";

export const IconButtonSize = {
  xs: "w-6 h-6 text-xs",
  sm: "w-7 h-7 text-sm",
  md: "w-8 h-8 text-lg",
  lg: "w-10 h-10 text-xl",
};

export type IconButtonSizeKey = keyof typeof IconButtonSize;

export interface IconButtonProps {
  icon: ReactNode;
  size?: IconButtonSizeKey;
  customSize?: boolean;
  customBorder?: boolean;
  customRounded?: boolean;
  customWrapper?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps & ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => {
    const elementProps = useMemo(() => {
      return omit(props, ["icon", "size", "customSize", "customBorder", "customRounded", "customWrapper"]);
    }, [props]);

    const size: IconButtonSizeKey = props.size ?? "sm";
    const sizeClassName = useMemo(() => {
      return !props.customSize && size in IconButtonSize ? IconButtonSize[size] : "";
    }, [props.customSize, size]);

    const borderClassName = props.customBorder ? "" : "border border-gray-300";
    const roundedClassName = props.customRounded ? "" : "rounded-md";

    return (
      <button
        {...elementProps}
        ref={ref}
        className={classes(
          "flex-none flex justify-center items-center active:opacity-70",
          sizeClassName,
          borderClassName,
          roundedClassName,
          props.className,
        )}
      >
        {props.customWrapper && props.icon}
        {!props.customWrapper && <Icon>{props.icon}</Icon>}
      </button>
    );
  },
);
