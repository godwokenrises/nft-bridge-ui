import { Wallet } from "ethers";
import { useMemo, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { Button, Input, Loader, TextInput, Tooltip } from "@mantine/core";
import { Empty } from "@/components/Status";
import { CopyTextButton } from "@/components/Button";
import { openTransactionResultModal, ScrollAreaModal } from "@/components/Modal";
import { Nrc721NftList } from "@/components/Nrc721Nft";
import { generateOmniLockAddress } from "@/modules/OmniLock";
import { AppCkbExplorerUrl, AppLumosConfig } from "@/constants/AppEnvironment";
import { Nrc721NftData, depositNrc721Nft } from "@/modules/Nrc721";
import { truncateCkbAddress } from "@/utils";

export function RequestDepositNft() {
  const [privateKey, setPrivateKey] = useState<string>("");
  const signer = useMemo(() => {
    try {
      return privateKey ? new Wallet(privateKey) : void 0;
    } catch(e) {
      console.error("Cannot create Wallet with this private-key");
      return void 0;
    }
  }, [privateKey]);
  const omniAddress = useMemo(() => {
    return signer ? generateOmniLockAddress(signer!.address, AppLumosConfig) : void 0;
  }, [privateKey]);

  const [sending, setSending] = useState(false);
  const [selectedNfts, setSelectedNfts] = useState<Nrc721NftData[]>([]);

  function isNftItemSelected(row: Nrc721NftData, selected: Nrc721NftData[]) {
    return selected.find((nft) => nft.tokenUri === row.tokenUri) !== void 0;
  }
  function onClickNftItem(row: Nrc721NftData, selected: boolean) {
    if (!sending) {
      setSelectedNfts(!selected ? [row] : []);
    }
  }
  function verifyForm() {
    if (sending) {
      return false;
    }
    if (!privateKey) {
      showNotification({
        color: "red",
        title: "Enter Private Key",
        message: "Please enter a valid Private Key",
      });
      return false;
    }
    if (!selectedNfts.length) {
      showNotification({
        color: "red",
        title: "Select target NFT",
        message: "Please select a target NFT to deposit",
      });
      return false;
    }

    return true;
  }
  async function deposit() {
    if (!verifyForm()) return;
    setSending(true);

    try {
      const txHash = await depositNrc721Nft({
        nftData: selectedNfts[0],
        ethAddress: signer!.address,
        fromAddress: omniAddress!,
        signer: signer!,
      });

      console.log("sent", txHash);

      setPrivateKey("");
      setSelectedNfts([]);
      openTransactionResultModal({
        modalId: "RequestDepositNft",
        title: "Deposit sent",
        subtitle: "The transaction is sent, please wait for the collector to collect and mint it on L2, or you can check the status of the transaction in the explorer",
        explorerUrl: `${AppCkbExplorerUrl}/transaction`,
        txHash: txHash,
      });
    } catch (e) {
      console.error("sendNrc721Nft", e);
      openTransactionResultModal({
        success: false,
        modalId: "RequestDepositNft",
        title: "Deposit failed",
        subtitle: "Failed to deposit NFT while sending transaction",
        error: (e as Error).message ?? "Unknown error, please check the details of the failure in console logs",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <div className="mt-3 px-3 pt-3 pb-1 rounded-t-xl bg-slate-50">
        <TextInput
          withAsterisk label="Private Key" variant="unstyled" size="lg" placeholder="Enter Private Key"
          value={privateKey || ""} onChange={(e) => setPrivateKey(e.target.value)}
        />
      </div>
      <div className="px-3 py-3 rounded-b-xl bg-slate-100">
        <div className="text-xs text-slate-700">L1 OmniLock Address</div>
        <div className="mt-0.5 break-all text-xs text-slate-500">
          {omniAddress && (
            <Tooltip withArrow multiline position="bottom-start" width={220} label={omniAddress}>
              <CopyTextButton  title="L1 OmniLock Address" content={omniAddress}>
                {truncateCkbAddress(omniAddress)}
              </CopyTextButton>
            </Tooltip>
          )}
          {!omniAddress && ("--")}
        </div>
      </div>

      <div className="mt-3 px-3 py-3 rounded-xl bg-slate-50">
        <Input.Wrapper withAsterisk label="NRC721 NFT" size="lg">
          <div className="mt-3">
            {omniAddress && (
              <Nrc721NftList
                address={omniAddress}
                selected={selectedNfts}
                onClickItem={onClickNftItem}
                isItemSelected={isNftItemSelected}
                empty={(
                  <Empty
                    customSize
                    classNames={{ root: "mt-3 mb-1.5", icon: "w-14 h-14 text-4xl" }}
                    title={(<div className="text-sm text-slate-400">No records</div>)}
                  />
                )}
              />
            )}
            {!omniAddress && (
              <Empty
                customSize
                classNames={{ root: "mt-3 mb-1.5", icon: "w-14 h-14 text-4xl" }}
                title={(<div className="text-sm text-slate-400">No records</div>)}
              />
            )}
          </div>
        </Input.Wrapper>
      </div>

      <Button fullWidth className="mt-5" color="teal" size="lg" radius="lg" loading={sending} onClick={deposit}>
        Deposit
      </Button>

      <ScrollAreaModal size={300} withCloseButton={false} opened={sending}>
        <div className="flex mx-auto w-[100px] h-[100px] justify-center items-center rounded-xl text-emerald-600">
          <Loader size="xl" color="currentColor" />
        </div>
        <div className="mt-1 text-center font-semibold text-slate-900">Depositing</div>
        <div className="mt-0.5 text-xs text-center text-slate-500">Please wait for the transaction to be completed</div>

        <Tooltip withArrow multiline width={220} position="bottom" label={<div className="text-center">Force to close the dialog</div>}>
          <Button fullWidth radius="md" variant="default" className="mt-6" onClick={() => setSending(false)}>Cancel</Button>
        </Tooltip>
      </ScrollAreaModal>
    </div>
  );
}
