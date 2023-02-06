import { AccountBalanceWalletOutlined, LogOutOutlined } from "@ricons/material";
import { Button, Tooltip } from "@mantine/core";
import { Icon } from "@ricons/utils";

import { CopyTextButton } from "@/components/Button";
import { useUnipassId } from "@/modules/Unipass";
import { truncateCkbAddress } from "@/utils";

export function UnipassWalletCard() {
  const { username, l1Address, disconnect } = useUnipassId();
  const fullL1Address = l1Address ? l1Address?.toCKBAddress() : void 0;
  const tuncatedL1Address = fullL1Address ? truncateCkbAddress(fullL1Address) : void 0;

  return (
    <div className="p-3 flex items-center rounded-2xl border border-slate-200 bg-white">
      <div className="w-10 h-10 flex justify-center items-center text-xl rounded-full text-slate-600 border border-slate-300">
        <Icon>
          <AccountBalanceWalletOutlined />
        </Icon>
      </div>
      <div className="ml-2 flex-auto flex flex-col justify-center">
        <div className="text-sm text-slate-800 font-semibold">{username}</div>
        <div className="leading-none">
          <Tooltip
            withArrow multiline position="bottom-start" width={220}
            label={(
              <div>
                <div className="mb-0.5 font-semibold">L1 UP-Lock Address</div>
                <div className="break-all">{fullL1Address ?? "--"}</div>
              </div>
            )}
          >
            <span>
              {!fullL1Address && (<span className="text-xs text-slate-500">--</span>)}
              {fullL1Address && (
                <CopyTextButton className="text-xs text-slate-500" title="L1 UP-Lock Address" content={fullL1Address}>
                  {tuncatedL1Address ?? "--"}
                </CopyTextButton>
              )}
            </span>
          </Tooltip>
        </div>
      </div>
      <div>
        <Tooltip withArrow label="Disconnect from UniPass">
          <Button compact variant="light" color="red" size="lg" radius="lg" onClick={disconnect}>
            <Icon>
              <LogOutOutlined />
            </Icon>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
