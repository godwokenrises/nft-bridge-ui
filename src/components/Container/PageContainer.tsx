import classes, { Argument } from "classnames";
import { PropsWithChildren } from "react";

export interface PageContainerProps {
  className?: Argument;
}

export function PageContainer(props: PropsWithChildren<PageContainerProps>) {
  return (
    <div className={classes("container", props.className)}>
      {props.children}
    </div>
  );
}
