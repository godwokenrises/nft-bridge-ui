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
    <header className="md:h-[65px] px-3 md:py-0 flex-none flex justify-center border-b border-grey-300 bg-white">
      <PageContainer className="h-full flex flex-col md:flex-row justify-between items-center">
        <div className="base-button pt-4 pb-1 md:py-0 h-full inline-flex items-center select-none">
          <img src="/favicon.ico" alt="" className="mr-1 pt-0.5 h-1/2" />
          <div>
            <div className="text-md font-bold text-emerald-700 leading-none">Godwoken</div>
            <div className="mt-0.5 text-xs text-emerald-600 leading-none">NFT Bridge (demo)</div>
          </div>
        </div>
        <div className="h-[50px] md:h-full flex-none md:flex-auto flex justify-end">
          <HeaderTabs />
        </div>
      </PageContainer>
    </header>
  );
}

export function HeaderTabs() {
  return (
    <div className="h-full">
      <HeaderTab to="transfer-ckb" pattern="/transfer-ckb/*">Transfer CKB</HeaderTab>
      <HeaderTab to="transfer-nft" pattern="/transfer-nft/*">Transfer NFT</HeaderTab>
      <HeaderTab to="bridge-nft" pattern="/bridge-nft/*">Bridge NFT</HeaderTab>
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
        "relative mx-2.5 inline-flex h-full items-center text-sm md:text-md",
        isActive ? "text-gray-900" : "text-gray-400",
      )}
    >
      {props.children}
      {isActive && <div className="absolute w-10 h-1 bottom-0 left-1/2 transform -translate-x-1/2 bg-green-500" />}
    </Link>
  );
}
