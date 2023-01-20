import { utils } from "ethers";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { Button, Input, Loader, TextInput, Tooltip } from "@mantine/core";
import { openTransactionResultModal, ScrollAreaModal } from "@/components/Modal";
import { UnipassWalletCard } from "@/components/Unipass";
import { Nrc721NftList } from "@/components/Nrc721Nft";
import { Empty } from "@/components/Status";
import { useUnipassId } from "@/modules/Unipass";
import { depositNrc721Nft, Nrc721NftData } from "@/modules/Nrc721";
import { AppCkbExplorerUrl } from "@/constants/AppEnvironment";
import { without } from "lodash";

export function RequestDepositNft() {
  const { l1Address, signTransactionSkeleton, sendTransaction } = useUnipassId();
  const fromAddress = l1Address ? l1Address?.toCKBAddress() : void 0;

  const [sending, setSending] = useState(false);
  const [ethAddress, setEthAddress] = useState<string>("");
  const [selectedNfts, setSelectedNfts] = useState<Nrc721NftData[]>([]);

  function isNftItemSelected(row: Nrc721NftData, selected: Nrc721NftData[]) {
    return selected.find((nft) => nft.tokenUri === row.tokenUri) !== void 0;
  }
  function onClickNftItem(row: Nrc721NftData, selected: boolean) {
    if (!sending) {
      setSelectedNfts(!selected ? [row] : []);
    }
  }
  function onMissingSelected(list: Nrc721NftData[]) {
    setSelectedNfts((selected) => {
      return without(selected, ...list);
    });
  }

  function verifyForm() {
    if (sending) {
      return false;
    }
    if (!fromAddress) {
      showNotification({
        color: "red",
        title: "Empty L1 UP-Lock Address",
        message: "No info of L1 UP-Lock Address, please check again and refresh the page",
      });
      return false;
    }
    if (!selectedNfts.length) {
      showNotification({
        color: "red",
        title: "Select NFT",
        message: "Please select an NFT to deposit to L2",
      });
      return false;
    }
    if (!ethAddress) {
      showNotification({
        color: "red",
        title: "Empty Recipient's address",
        message: "Please enter a L2 Wallet Address (Ethereum Address) to receive the NFT on L2",
      });
      return false;
    }
    if (!utils.isAddress(ethAddress)) {
      showNotification({
        color: "red",
        title: "Invalid Recipient's address",
        message: "Please enter a valid L2 Wallet Address (Ethereum Address) to receive the NFT on L2",
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
        fromAddress: fromAddress!,
        ethAddress: ethAddress!,
        signTransactionSkeleton,
        sendTransaction,
      });

      console.log("sent", txHash);

      setEthAddress("");
      setSelectedNfts([]);
      openTransactionResultModal({
        modalId: "RequestDepositNft",
        title: "Deposit sent",
        subtitle: "The transaction is sent, please wait for the collector to collect and mint it on L2, or you can check the status of the transaction in the explorer",
        explorerUrl: `${AppCkbExplorerUrl}/transaction`,
        txHash: txHash,
        onClose: () => setSending(false),
      });
    } catch (e) {
      console.error("sendNrc721Nft", e);
      const message = (e as Error).message ?? (typeof e == "string" && e);
      openTransactionResultModal({
        success: false,
        modalId: "RequestDepositNft",
        title: "Deposit failed",
        subtitle: "Failed to deposit NFT while signing/sending transaction",
        error: message ?? "Unknown error, please check the details of the failure in console logs",
        onClose: () => setSending(false),
      });
    }
  }

  return (
    <div>
      <UnipassWalletCard />

      <div className="mt-3 px-3 py-3 rounded-xl bg-slate-50">
        <Input.Wrapper withAsterisk label="NRC721 NFT" size="lg">
          <div className="mt-3">
            {fromAddress && !sending && (
              <Nrc721NftList
                disabled={sending}
                address={fromAddress}
                selected={selectedNfts}
                onClickItem={onClickNftItem}
                isItemSelected={isNftItemSelected}
                onMissingSelected={onMissingSelected}
                empty={(
                  <Empty
                    customSize
                    classNames={{ root: "mt-3 mb-1.5", icon: "w-14 h-14 text-4xl" }}
                    title={(<div className="text-sm text-slate-400">No records</div>)}
                  />
                )}
              />
            )}
            {!fromAddress && (
              <Empty
                customSize
                classNames={{ root: "mt-3 mb-1.5", icon: "w-14 h-14 text-4xl" }}
                title={(<div className="text-sm text-slate-400">No records</div>)}
              />
            )}
          </div>
        </Input.Wrapper>
      </div>

      <div className="mt-3 px-3 pt-3 pb-1 rounded-xl bg-slate-50">
        <TextInput
          withAsterisk label="Recipient on L2" variant="unstyled" size="lg" placeholder="Enter L2 Wallet Address"
          value={ethAddress} onChange={(e) => setEthAddress(e.target.value)}
        />
      </div>

      <Button fullWidth className="mt-8" color="teal" size="lg" radius="lg" loading={sending} onClick={deposit}>
        Deposit
      </Button>

      {sending && (
        <ScrollAreaModal size={300} withCloseButton={false} opened={sending}>
          <div className="flex mx-auto w-[100px] h-[100px] justify-center items-center rounded-xl text-emerald-600">
            <Loader size="xl" color="currentColor" />
          </div>
          <div className="mt-1 text-center font-semibold text-slate-900">Depositing</div>
          <div className="mt-0.5 text-xs text-center text-slate-500">Please confirm transaction in the UniPassID Popup, and then wait for the transaction to be completed</div>

          <Tooltip withArrow multiline width={220} position="bottom" label={<div className="text-center">Force to ignore the transaction</div>}>
            <Button fullWidth radius="md" variant="default" className="mt-6" onClick={() => setSending(false)}>Cancel</Button>
          </Tooltip>
        </ScrollAreaModal>
      )}
    </div>
  );
}
