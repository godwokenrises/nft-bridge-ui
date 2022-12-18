import classes, { Argument } from "classnames";
import { PropsWithChildren } from "react";

export interface PageWrapperProps {
  className?: Argument;
}

export function PageWrapper(props: PropsWithChildren<PageWrapperProps>) {
  return (
    <div className={classes("px-3 py-6 flex-auto flex justify-center", props.className)}>
      {props.children}
    </div>
  );
}
