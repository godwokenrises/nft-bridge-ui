import classes, { Argument } from "classnames";
import { PropsWithChildren } from "react";

export interface PageCardProps {
  className?: Argument;
}

export function PageCard(props: PropsWithChildren<PageCardProps>) {
  return (
    <div
      className={classes("p-4 w-full md:w-[500px] rounded-2xl border border-slate-200 bg-white", props.className)}>
      {props.children}
    </div>
  );
}
