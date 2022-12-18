import { ReactNode } from "react";

export type PropsWithRequiredChildren<T extends {}> = T & {
  children: ReactNode;
};
