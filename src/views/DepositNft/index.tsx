import { Alert } from "@mantine/core";
import { RequestDepositNft } from "@/components/DepositNft";
import { PageCard, PageContainer, PageWrapper } from "@/components/Container";
import { useUnipassId } from "@/modules/Unipass";
import { ConnectUnipassId } from "@/components/Unipass";

export function DepositNftPage() {
  const { connected } = useUnipassId();

  return (
    <PageWrapper>
      <PageContainer className="flex-auto flex flex-col items-center">
        <div className="mb-4 w-full md:w-[500px]">
          <Alert title="Early Accessing" color="orange" radius="lg" className="!border !border-orange-200">
            This feature is in early development, and it only supports NFT Collections in our allow list.
            If you find any issues with the feature, please <a className="text-emerald-600 underline" href="https://github.com/ShookLyngs/test-unipass-sdk/issues" target="_blank">open an issue</a> to let us know.
          </Alert>
        </div>
        <PageCard>
          <div className="mb-4 text-xl font-semibold">Deposit NFT</div>
          {connected ? <RequestDepositNft /> :  <ConnectUnipassId />}
        </PageCard>
      </PageContainer>
    </PageWrapper>
  );
}
