import classes from "classnames";
import { ScrollArea } from "@mantine/core";
import { PropsWithChildren, useMemo } from "react";
import { Link, matchPath, Outlet, PathPattern, useLocation } from "react-router-dom";
import { PageContainer } from "@/components/Container";

export function HomeLayout(props: PropsWithChildren) {
  return (
    <div className="fixed inset-0 flex flex-col font-sans">
      <HomeHeader />
      <ScrollArea
        scrollbarSize={8}
        className="flex-auto flex bg-gray-100"
        classNames={{
          viewport: "scroll-area-viewport--full",
        }}
      >
        {props.children ?? <Outlet />}
      </ScrollArea>
    </div>
  );
}

export function HomeHeader() {
  return (
    <header className="h-[65px] px-3 flex-none flex justify-center border-b border-grey-300 bg-white">
      <PageContainer className="h-full flex justify-between items-center">
        <div className="base-button h-full inline-flex items-center select-none">
          <div>
            <div className="text-xl font-bold text-slate-900 leading-none">UniPass</div>
            <div className="mt-0.5 text-xs text-slate-300 leading-none">SDK Testing Program</div>
          </div>
        </div>
        <div className="flex-auto flex justify-end h-full">
          <HeaderTabs />
        </div>
      </PageContainer>
    </header>
  );
}

export function HeaderTabs() {
  return (
    <div className="h-full">
      <HeaderTab to="transfer-ckb" pattern="/transfer-ckb/*">
        Transfer CKB
      </HeaderTab>
      <HeaderTab to="bridge-nft" pattern="/bridge-nft/*">
        Bridge NFT
      </HeaderTab>
    </div>
  );
}

export interface HeaderTabProps<Path extends string = string> {
  to: string;
  pattern: Path | PathPattern<Path>;
}

export function HeaderTab(props: PropsWithChildren<HeaderTabProps>) {
  const location = useLocation();
  const isActive = useMemo(
    () => matchPath(props.pattern, location.pathname) !== null,
    [props.pattern, location.pathname],
  );

  return (
    <Link
      to={props.to}
      className={classes(
        "relative mx-2.5 inline-flex h-full items-center",
        isActive ? "text-gray-900" : "text-gray-400",
      )}
    >
      {props.children}
      {isActive && <div className="absolute w-10 h-1 bottom-0 left-1/2 transform -translate-x-1/2 bg-green-500" />}
    </Link>
  );
}
