import UpCkb from "up-ckb-alpha-test";
import { useState } from "react";
import { Icon } from "@ricons/utils";
import { Button, Tooltip, TextInput, NumberInput } from "@mantine/core";
import { AccountBalanceWalletOutlined, LogOutOutlined } from "@ricons/material";
import { PageCard, PageContainer, PageWrapper } from "@/components/Container";
import { ConnectUnipassId } from "@/components/Unipass";
import { CopyTextButton } from "@/components/Button";
import { useUnipassId } from "@/states/Unipass/useUnipass";
import { truncateCkbAddress } from "@/utils";
import { Address, AddressType, Amount } from "@lay2/pw-core";
import { UPCoreSimpleProvider } from "@/states/Unipass/UpCoreSimpleProvider";
import { UpLockCodeHash } from "@/states/Unipass/UpState";
import { showNotification } from "@mantine/notifications";

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
  const fullL1Address = l1Address ? l1Address?.toCKBAddress() : void 0;
  const tuncatedL1Address = fullL1Address ? truncateCkbAddress(fullL1Address) : void 0;

  const [amount, setAmount] = useState<number | undefined>(void 0);
  const [address, setAddress] = useState<string>("");
  const [sending, setSending] = useState(false);

  async function send() {
    if (sending) return console.log("sending tx");
    if (!username) return console.log("no userinfo");
    if (!address) return console.log("no address");
    if (!amount) return console.log("no amount");

    setSending(true);

    const toAmount = new Amount(String(amount!));
    const toAddress = new Address(address!, AddressType.ckb);
    const provider = new UPCoreSimpleProvider(username!, UpLockCodeHash);
    console.log("transferring:", toAddress, toAmount);

    try {
      const txHash = await UpCkb.sendCKB(toAddress, toAmount, provider);
      setAmount(void 0);
      setAddress("");
      showNotification({
        autoClose: false,
        color: "green",
        title: "Transfer Completed",
        message: `Click to view the transaction: ${txHash}`,
        onClick: () => window.open(`https://pudge.explorer.nervos.org/transaction/${txHash}`, "_blank"),
      });
    } catch (e) {
      console.error("tx failed:", e);
      showNotification({
        color: "red",
        title: "Transfer Failed",
        message: (e as Error).message ?? "The transaction failed for unknown reason",
      });
    } finally {
      setSending(false);
    }
  }

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

      <div className="mt-8 px-3 pt-3 pb-1 rounded-xl bg-slate-50">
        <NumberInput
          withAsterisk hideControls removeTrailingZeros noClampOnBlur
          label="Transfer Amount" variant="unstyled" size="lg" placeholder="0" precision={4}
          value={amount} onChange={setAmount}
        />
      </div>
      <div className="mt-3 px-3 pt-3 pb-1 rounded-xl bg-slate-50">
        <TextInput
          withAsterisk label="Recipient" variant="unstyled" size="lg" placeholder="CKB Address"
          value={address} onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <Button fullWidth className="mt-5" color="teal" size="lg" radius="lg" loading={sending} onClick={send}>
        Transfer
      </Button>
    </div>
  );
}
