import classes from "classnames";
import { ReactNode } from "react";
import { Icon } from "@ricons/utils";
import { InboxOutlined } from "@ricons/antd";
import { ClassNames } from "@mantine/core";


export interface EmptyProps {
  title?: ReactNode;
  customSize?: boolean;
  classNames?: ClassNames<"root" | "icon">;
}

export function Empty(props: EmptyProps) {
  return (
    <div className={classes("flex flex-col justify-center items-center", props.classNames?.root)}>
      <div className={classes(
        "flex justify-center items-center rounded-full text-gray-500 bg-gray-100",
        !props.customSize ? "w-20 h-20 text-6xl " : void 0,
        props.classNames?.icon
      )}>
        <Icon>
          <InboxOutlined />
        </Icon>
      </div>
      {props.title && (
        <div className="mt-3 text-lg text-gray-600">{props.title}</div>
      )}
    </div>
  );
}
