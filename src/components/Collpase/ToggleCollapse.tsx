import { Collapse } from '@mantine/core';
import { ReactNode, useState } from "react";
import { Icon } from "@ricons/utils";
import { ExpandMoreRound, ExpandLessRound } from "@ricons/material";

export interface ToggleCollapseProps {
  initial?: boolean;
  title: ReactNode;
  children?: ReactNode;
}

export function ToggleCollapse(props: ToggleCollapseProps) {
  const [opened, setOpened] = useState(props.initial ?? false);
  function toggle() {
    setOpened((v) => !v);
  }

  return (
    <div>
      <div className="flex items-center py-2 cursor-pointer" onClick={toggle}>
        <div className="flex-auto text-slate-900 font-semibold">
          {props.title}
        </div>
        <div className="inline-flex items-center text-xl text-slate-600">
          <Icon>
            {opened ? <ExpandLessRound /> : <ExpandMoreRound />}
          </Icon>
        </div>
      </div>
      <Collapse in={opened}>
        <div className="w-full pb-4">
          {props.children}
        </div>
      </Collapse>
    </div>
  );
}
