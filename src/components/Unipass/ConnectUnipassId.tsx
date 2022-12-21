import { Icon } from "@ricons/utils";
import { Button, Loader, Tooltip } from "@mantine/core";
import { AccountBalanceWalletOutlined } from "@ricons/material";
import { ScrollAreaModal } from "@/components/Modal";
import { useUnipassId } from "@/states/Unipass/useUnipass";

export function ConnectUnipassId() {
  const { connecting, connect, disconnect } = useUnipassId();

  return (
    <>
      <Button
        fullWidth
        size="md"
        radius="md"
        variant="default"
        loaderPosition="right"
        loading={connecting}
        onClick={connect}
        rightIcon={
          <div className="flex items-center text-xl text-emerald-700">
            <Icon>
              <AccountBalanceWalletOutlined />
            </Icon>
          </div>
        }
      >
        Connect UniPass
      </Button>
      <ScrollAreaModal size={300} withCloseButton={false} opened={connecting}>
        <div className="flex mx-auto w-[100px] h-[100px] justify-center items-center rounded-xl text-emerald-600">
          <Loader size="xl" color="currentColor" />
        </div>
        <div className="mt-1 text-center font-semibold text-slate-900">Connecting</div>
        <div className="mt-0.5 text-xs text-center text-slate-500">Please connect to your UniPassId</div>

        <Tooltip withArrow multiline width={220} position="bottom" label={<div className="text-center">Please make sure you've closed the connector of UniPass</div>}>
          <Button fullWidth radius="md" variant="default" className="mt-6" onClick={disconnect}>Cancel</Button>
        </Tooltip>
      </ScrollAreaModal>
    </>
  );
}
