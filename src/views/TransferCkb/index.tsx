import UpCkb from "up-ckb-alpha-test";
import { useState } from "react";
import { helpers } from "@ckb-lumos/lumos";
import { Address, AddressType, Amount } from "@lay2/pw-core";
import { Button, TextInput, NumberInput, Loader, Tooltip, Alert } from "@mantine/core";
import { PageCard, PageContainer, PageWrapper } from "@/components/Container";
import { ConnectUnipassId, UnipassWalletCard } from "@/components/Unipass";
import { openTransactionResultModal, ScrollAreaModal } from "@/components/Modal";
import { showNotification } from "@mantine/notifications";
import { useUnipassId, UPCoreSimpleProvider } from "@/modules/Unipass";

import { AppCkbExplorerUrl, AppLumosConfig, AppUnipassConfig } from "@/constants/AppEnvironment";

export function TransferCkbPage() {
  const { connected } = useUnipassId();

  return (
    <PageWrapper>
      <PageContainer className="flex-auto flex flex-col items-center">
        {connected && (
          <div className="mb-4 w-full md:w-[500px]">
            <UnipassWalletCard />
          </div>
        )}
        <PageCard>
          <div className="mb-4 text-xl font-semibold">Transfer CKB</div>
          {connected ? <TransferCkbRequest /> : <ConnectUnipassId />}
        </PageCard>

        <div className="mt-4 w-full md:w-[500px]">
          <Alert title="Early Accessing" color="orange" radius="lg" className="!border !border-orange-200">
            This feature is in early development, and it only supports NFT Collections in our allow list.
            If you find any issues with the feature, please <a className="text-emerald-600 underline" href="https://github.com/godwokenrises/nft-bridge-ui/issues" target="_blank">open an issue</a> to let us know.
          </Alert>
        </div>
      </PageContainer>
    </PageWrapper>
  );
}

export function TransferCkbRequest() {
  const { username } = useUnipassId();

  const [amount, setAmount] = useState<number | undefined>(void 0);
  const [address, setAddress] = useState<string>("");
  const [sending, setSending] = useState(false);

  function verifyForm(notify: boolean = false) {
    if (sending) {
      return false;
    }
    if (!username) {
      if (notify) showNotification({
        color: "red",
        title: "No userinfo",
        message: "No userinfo to fill in, maybe you need to refresh and login",
      });
      return false;
    }
    if (!amount) {
      if (notify) showNotification({
        color: "red",
        title: "Enter transfer amount",
        message: "Please enter a valid transfer amount",
      });
      return false;
    }
    if (!address) {
      if (notify) showNotification({
        color: "red",
        title: "Enter recipient's address",
        message: "Please enter the recipient's address",
      });
      return false;
    }
    try {
      helpers.parseAddress(address, {
        config: AppLumosConfig,
      });
    } catch {
      if (notify) showNotification({
        color: "red",
        title: "Invalid recipient's address",
        message: "Please enter a valid CKB Address to receive CKB on L1",
      });
      return false;
    }
    return true;
  }
  async function send() {
    if (!verifyForm(true)) return;
    setSending(true);

    const toAmount = new Amount(String(amount!));
    const toAddress = new Address(address!, AddressType.ckb);
    const provider = new UPCoreSimpleProvider(username!, AppUnipassConfig.ckb.upLockCodeHash);
    console.log("transferring:", toAddress, toAmount);

    try {
      const txHash = await UpCkb.sendCKB(toAddress, toAmount, provider);

      setAddress("");
      setAmount(void 0);
      openTransactionResultModal({
        modalId: "RequestTransferCkb",
        title: "Transfer completed",
        subtitle: "The transaction is sent, please keep the TxHash so you can check the status of the transaction in the explorer",
        explorerUrl: `${AppCkbExplorerUrl}/transaction`,
        txHash: txHash,
      });
    } catch (e) {
      console.error("tx failed:", e);

      const message = (e as Error).message ?? (typeof e == "string" && e);
      openTransactionResultModal({
        success: false,
        modalId: "RequestTransferCKB",
        title: "Transfer failed",
        subtitle: "Failed to transfer CKB while signing/sending transaction",
        error: message ?? "Unknown error, please check the details of the failure in console logs",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <div className="mt-3 px-3 pt-3 pb-1 rounded-xl bg-slate-50">
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

      <Button fullWidth className="mt-8" color="teal" size="lg" radius="lg" loading={sending} onClick={send}>
        Transfer
      </Button>

      <ScrollAreaModal size={300} withCloseButton={false} opened={sending}>
        <div className="flex mx-auto w-[100px] h-[100px] justify-center items-center rounded-xl text-emerald-600">
          <Loader size="xl" color="currentColor" />
        </div>
        <div className="mt-1 text-center font-semibold text-slate-900">Transferring</div>
        <div className="mt-0.5 text-xs text-center text-slate-500">Please confirm transaction in the UniPassID Popup, and then wait for the transaction to be completed</div>

        <Tooltip withArrow multiline width={220} position="bottom" label={<div className="text-center">Force to ignore the transaction</div>}>
          <Button fullWidth radius="md" variant="default" className="mt-6" onClick={() => setSending(false)}>Cancel</Button>
        </Tooltip>
      </ScrollAreaModal>
    </div>
  );
}
