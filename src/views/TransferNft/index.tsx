import { Alert } from "@mantine/core";
import { useUnipassId } from "@/modules/Unipass";
import { RequestTransferNft } from "@/components/TransferNft";
import { PageCard, PageContainer, PageWrapper } from "@/components/Container";
import { ConnectUnipassId } from "@/components/Unipass";

export function TransferNftPage() {
  const { connected } = useUnipassId();

  return (
    <PageWrapper>
      <PageContainer className="flex-auto flex flex-col items-center">
        <div className="mb-4 w-full md:w-[500px]">
          <Alert title="Early Accessing" color="orange" radius="lg" className="!border !border-orange-200">
            This feature is in early development, and it only supports NFT Collections in our allow list.
            If you've found any issue with the feature, please <a className="text-emerald-600 underline" href="https://github.com/ShookLyngs/test-unipass-sdk/issues" target="_blank">open an issue</a> to let us know.
          </Alert>
        </div>
        <PageCard>
          <div className="mb-4 text-xl font-semibold">Transfer NFT</div>
          {connected ? <RequestTransferNft /> : <ConnectUnipassId />}
        </PageCard>
      </PageContainer>
    </PageWrapper>
  );
}
