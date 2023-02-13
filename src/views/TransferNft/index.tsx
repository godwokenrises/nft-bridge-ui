import { Alert } from "@mantine/core";
import { ToggleCollapse } from "@/components/Collpase";
import { RequestTransferNft } from "@/components/TransferNft";
import { PageCard, PageContainer, PageWrapper } from "@/components/Container";
import { ConnectUnipassId, UnipassWalletCard } from "@/components/Unipass";
import { useUnipassId } from "@/modules/Unipass";

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
          <Alert title="Helps" color="orange" radius="lg" className="!border !border-orange-200 ">
            <ToggleCollapse title="How to transfer NFT(s)?">
              <div className="text-slate-800">
                <div className="mb-1">
                  <div>
                    Transfer NFT is a feature to help you transfer target NFT(s) to other addresses.
                    Here's the tutorial for the feature:
                  </div>
                </div>

                <ol className="list-decimal list-inside font-semibold">
                  <li>Select an NFT that you want to transfer</li>
                  <li>Paste a L1 Wallet address to receive selected NFT(s)</li>
                  <li>Click the Submit button to start transferring</li>
                  <li>Confirm transaction and wait for the result</li>
                  <li>Keep the TxHash after submission</li>
                </ol>
              </div>
            </ToggleCollapse>
            <ToggleCollapse title="Early Accessing">
              <div className="text-slate-800">
                The Godwoken NFT Bridge (beta) is still in early development, you may experience issues using the app.
                If you find any issues, please <a className="text-emerald-600 underline" href="https://github.com/godwokenrises/nft-bridge-ui/issues" target="_blank">open an issue</a> to let us know.
              </div>
            </ToggleCollapse>
          </Alert>
        </div>
      </PageContainer>
    </PageWrapper>
  );
}
