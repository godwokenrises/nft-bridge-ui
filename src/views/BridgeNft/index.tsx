import { Alert } from "@mantine/core";
import { ToggleCollapse } from "@/components/Collpase";
import { RequestBridgeNft } from "@/components/BridgeNft";
import { PageCard, PageContainer, PageWrapper } from "@/components/Container";
import { ConnectUnipassId, UnipassWalletCard } from "@/components/Unipass";
import { useUnipassId } from "@/modules/Unipass";

export function BridgeNftPage() {
  const { connected } = useUnipassId();

  return (
    <PageWrapper>
      <PageContainer className="flex-auto flex flex-col items-center">
        {/*<div className="mb-4 w-full md:w-[500px]">
          <Alert title="Early Accessing" color="orange" radius="lg" className="!border !border-orange-200">
            This feature is in early development, and it only supports NFT Collections in our allow list.
            If you find any issues with the feature, please <a className="text-emerald-600 underline" href="https://github.com/godwokenrises/nft-bridge-ui/issues" target="_blank">open an issue</a> to let us know.
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
          <Alert title="Helps" color="orange" radius="lg" className="!border !border-orange-200 ">
            <ToggleCollapse title="How to bridge NFT(s) to Godwoken L2?">
              <div className="text-slate-800">
                <div className="mb-1">
                  <div>
                    Bridge NFT is a feature to bridge your target NFT(s) to Godwoken L2.
                    Here's the tutorial for the feature:
                  </div>
                </div>

                <ol className="list-decimal list-inside font-semibold">
                  <li>Select an NFT that you want to bridge</li>
                  <li>Paste a L2 (Ethereum) address to receive selected NFT(s)</li>
                  <li>Click the Submit button to start bridging</li>
                  <li>Confirm transaction and keep the TxHash after submission</li>
                  <li>NFT Bridge Collector will collect and mint your bridged NFT(s) on Godwoken L2</li>
                </ol>
              </div>
            </ToggleCollapse>
            <ToggleCollapse title="One-way bridging">
              <div className="text-slate-800">
                Note that in the current version, Godwoken NFT Bridge only supports one-way bridging,
                your NFT(s) can only be bridged from CKB L1 to Godwoken L2, not from Godwoken L2 to CKb L1.
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
