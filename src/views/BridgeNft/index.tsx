import { Alert } from "@mantine/core";
import { RequestBridgeNft } from "@/components/BridgeNft";
import { PageCard, PageContainer, PageWrapper } from "@/components/Container";
import { useUnipassId } from "@/modules/Unipass";
import { ConnectUnipassId, UnipassWalletCard } from "@/components/Unipass";

export function BridgeNftPage() {
  const { connected } = useUnipassId();

  return (
    <PageWrapper>
      <PageContainer className="flex-auto flex flex-col items-center">
        {/*<div className="mb-4 w-full md:w-[500px]">
          <Alert title="Early Accessing" color="orange" radius="lg" className="!border !border-orange-200">
            This feature is in early development, and it only supports NFT Collections in our allow list.
            If you find any issues with the feature, please <a className="text-emerald-600 underline" href="https://github.com/ShookLyngs/test-unipass-sdk/issues" target="_blank">open an issue</a> to let us know.
          </Alert>
        </div>*/}
        {connected && (
          <div className="mb-4 w-full md:w-[500px]">
            <UnipassWalletCard />
          </div>
        )}
        <PageCard>
          <div className="mb-4 text-xl font-semibold">Bridge NFT</div>
          {connected ? <RequestBridgeNft /> :  <ConnectUnipassId />}
        </PageCard>

        <div className="mt-4 w-full md:w-[500px]">
          <Alert title="Tutorial for the feature" color="orange" radius="lg" className="!border !border-orange-200">
            <div className="mb-1 color-slate-800">
              <div>
                Bridge NFT is a feature to help you bridge target NFT(s) to Godwoken L2.
                Here's the tutorial for the feature:
              </div>
            </div>

            <ol className="list-decimal list-inside color-slate-900 font-semibold">
              <li>Select an NFT that you want to bridge</li>
              <li>Paste a L2 (Ethereum) address to receive selected NFT(s)</li>
              <li>Click the Submit button to start bridging</li>
              <li>Confirm transaction and keep the TxHash after submission</li>
              <li>NFT Bridge Collector will collect and mint your bridged NFT(s) on Godwoken L2</li>
            </ol>
          </Alert>
        </div>
      </PageContainer>
    </PageWrapper>
  );
}
