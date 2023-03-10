import { utils } from "ethers";
import { without } from "lodash";
import { useMemo, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { Button, Input, Loader, TextInput, Tooltip } from "@mantine/core";
import { ScrollAreaModal, openTransactionResultModal } from "@/components/Modal";
import { CheckoutTransferNft } from "@/components/TransferNft";
import { Nrc721NftList } from "@/components/Nrc721Nft";
import { Empty } from "@/components/Status";
import { UpTxAdditionalFee, useUnipassId } from "@/modules/Unipass";
import { bridgeNrc721Nft, generateNrc721BridgeTransaction, Nrc721NftData } from "@/modules/Nrc721";
import { useNrc721TransferCheckout } from "@/modules/Nrc721";

import { AppCkbExplorerUrl, AppCkbIndexer, AppLumosConfig } from "@/constants/AppEnvironment";
import { useCkbBalance } from "@/modules/Ckb";

export function RequestBridgeNft() {
  const { l1Address, signTransactionSkeleton } = useUnipassId();
  const fromAddress = l1Address ? l1Address?.toCKBAddress() : void 0;

  const balance = useCkbBalance({
    address: fromAddress,
    indexer: AppCkbIndexer,
    lumosConfig: AppLumosConfig,
  });

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

  const isFormValid = useMemo(() => verifyForm(), [fromAddress, ethAddress, selectedNfts]);
  const checkout = useNrc721TransferCheckout({
    deps: [isFormValid, fromAddress, ethAddress, JSON.stringify(selectedNfts)],
    getter: async () => {
      if (!isFormValid) return void 0;
      const payload = getTransferPayload();
      return await generateNrc721BridgeTransaction(payload);
    },
  });

  function verifyForm(notify: boolean = false) {
    if (sending) {
      return false;
    }
    if (!fromAddress) {
      if (notify) showNotification({
        color: "red",
        title: "Empty L1 UP-Lock Address",
        message: "No info of L1 UP-Lock Address, please check again and refresh the page",
      });
      return false;
    }
    if (!selectedNfts.length) {
      if (notify) showNotification({
        color: "red",
        title: "Select NFT",
        message: "Please select an NFT to bridge to L2",
      });
      return false;
    }
    if (!ethAddress) {
      if (notify) showNotification({
        color: "red",
        title: "Empty Recipient's address",
        message: "Please enter a L2 Wallet Address (Ethereum Address) to receive the NFT on L2",
      });
      return false;
    }
    if (!utils.isAddress(ethAddress)) {
      if (notify) showNotification({
        color: "red",
        title: "Invalid Recipient's address",
        message: "Please enter a valid L2 Wallet Address (Ethereum Address) to receive the NFT on L2",
      });
      return false;
    }

    return true;
  }
  function getTransferPayload() {
    return {
      nftData: selectedNfts[0],
      fromAddress: fromAddress!,
      ethAddress: ethAddress!,
      additionalFee: UpTxAdditionalFee,
      signTransactionSkeleton,
    };
  }
  async function send() {
    if (!verifyForm(true)) return;
    setSending(true);

    try {
      const payload = getTransferPayload();
      const txHash = await bridgeNrc721Nft(payload);

      console.log("sent", txHash);

      setEthAddress("");
      setSelectedNfts([]);
      openTransactionResultModal({
        modalId: "RequestBridgeNft",
        title: "Bridge transaction sent",
        subtitle: "The transaction is sent, please keep the TxHash and wait for NFT Bridge Collector to bridge the selected NFT(s) on L2, or you can check the status of the transaction in the explorer",
        explorerUrl: `${AppCkbExplorerUrl}/transaction`,
        txHash: txHash,
        onClose: () => setSending(false),
      });
    } catch (e) {
      console.error("sendNrc721Nft", e);
      const message = (e as Error).message ?? (typeof e == "string" && e);
      openTransactionResultModal({
        success: false,
        modalId: "RequestBridgeNft",
        title: "Bridge transaction failed",
        subtitle: "Failed to bridge NFT while signing/sending transaction",
        error: message ?? "Unknown error, please check the details of the failure in console logs",
        onClose: () => setSending(false),
      });
    }
  }

  return (
    <div>
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

      <div className="py-4 flex justify-center">
        <div className="w-6 h-px bg-slate-300" />
      </div>

      <CheckoutTransferNft
        address={fromAddress}
        isCheckoutEnabled={isFormValid}
        selectedNftsLength={selectedNfts.length}
        checkout={checkout}
        balance={balance}
      />
      <Button fullWidth color="teal" size="lg" radius="lg" loading={sending} onClick={send}>
        Bridge
      </Button>

      {sending && (
        <ScrollAreaModal size={300} withCloseButton={false} opened={sending}>
          <div className="flex mx-auto w-[100px] h-[100px] justify-center items-center rounded-xl text-emerald-600">
            <Loader size="xl" color="currentColor" />
          </div>
          <div className="mt-1 text-center font-semibold text-slate-900">Bridging</div>
          <div className="mt-0.5 text-xs text-center text-slate-500">Please confirm transaction in the UniPassID Popup, and then wait for the transaction to be completed</div>

          <Tooltip withArrow multiline width={220} position="bottom" label={<div className="text-center">Force to ignore the transaction</div>}>
            <Button fullWidth radius="md" variant="default" className="mt-6" onClick={() => setSending(false)}>Cancel</Button>
          </Tooltip>
        </ScrollAreaModal>
      )}
    </div>
  );
}
