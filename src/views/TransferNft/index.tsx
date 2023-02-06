import { Alert } from "@mantine/core";
import { useUnipassId } from "@/modules/Unipass";
import { RequestTransferNft } from "@/components/TransferNft";
import { PageCard, PageContainer, PageWrapper } from "@/components/Container";
import { ConnectUnipassId, UnipassWalletCard } from "@/components/Unipass";

export function TransferNftPage() {
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
          <div className="mb-4 text-xl font-semibold">Transfer NFT</div>
          {connected ? <RequestTransferNft /> : <ConnectUnipassId />}
        </PageCard>

        <div className="mt-4 w-full md:w-[500px]">
          <Alert title="Notes for the feature" color="teal" radius="lg" className="!border !border-orange-200">
            <div className="mb-1 color-slate-800">
              <div>
                Transfer NFT is a feature to help you transfer target NFT(s) to other addresses.
                Here's the tutorial for the feature:
              </div>
            </div>

            <ol className="list-decimal list-inside color-slate-900 font-semibold">
              <li>Select an NFT that you want to transfer</li>
              <li>Paste a L1 Wallet address to receive selected NFT(s)</li>
              <li>Click the Submit button to start transferring</li>
              <li>Confirm transaction and wait for the result</li>
              <li>Keep the TxHash after submission</li>
            </ol>
          </Alert>
        </div>
      </PageContainer>
    </PageWrapper>
  );
}
