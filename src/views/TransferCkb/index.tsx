import { Icon } from "@ricons/utils";
import { Button, Tooltip, TextInput, NumberInput } from "@mantine/core";
import { AccountBalanceWalletOutlined, LogOutOutlined } from "@ricons/material";
import { PageCard, PageContainer, PageWrapper } from "@/components/Container";
import { ConnectUnipassId } from "@/components/Unipass";
import { useUnipassId } from "@/states/Unipass/useUnipass";
import { truncateCkbAddress } from "@/utils";

export function TransferCkbPage() {
  const { connected } = useUnipassId();

  return (
    <PageWrapper>
      <PageContainer className="flex-auto flex flex-col items-center">
        <PageCard>
          <div className="mb-4 text-xl font-semibold">Transfer CKB</div>
          {connected ? <TransferCkbRequest /> : <ConnectUnipassId />}
        </PageCard>
      </PageContainer>
    </PageWrapper>
  );
}

export function TransferCkbRequest() {
  const { username, l1Address, disconnect } = useUnipassId();
  const tuncatedL1Address = l1Address ? truncateCkbAddress(l1Address.toCKBAddress()) : void 0;

  return (
    <div>
      <div className="p-3 flex items-center rounded-xl border border-slate-200">
        <div className="w-10 h-10 flex justify-center items-center text-xl rounded-full text-slate-600 border border-slate-300">
          <Icon>
            <AccountBalanceWalletOutlined />
          </Icon>
        </div>
        <div className="ml-2 flex-auto flex flex-col justify-center">
          <div className="text-sm text-slate-800 font-semibold">{username}</div>
          <div className="leading-none">
            <Tooltip
              withArrow multiline position="bottom" width={220}
              label={<span className="break-all">{l1Address?.toCKBAddress() ?? "--"}</span>}
            >
              <span className="text-xs text-slate-500">{tuncatedL1Address ?? "--"}</span>
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

      <div className="mt-8 px-3 pt-3 pb-1 rounded-xl bg-slate-50">
        <NumberInput
          withAsterisk hideControls removeTrailingZeros noClampOnBlur
          label="Transfer Amount" variant="unstyled" size="lg" placeholder="0" precision={4}
          rightSection="CKB"
        />
      </div>
      <div className="mt-3 px-3 pt-3 pb-1 rounded-xl bg-slate-50">
        <TextInput withAsterisk label="Recipient" variant="unstyled" size="lg" placeholder="CKB Address" />
      </div>

      <Button fullWidth className="mt-5" color="teal" size="lg" radius="lg">
        Transfer
      </Button>
    </div>
  );
}
