import { Alert } from "@mantine/core";
import { RequestTransferNft } from "@/components/TransferNft";
import { PageCard, PageContainer, PageWrapper } from "@/components/Container";

export function TransferNftPage() {
  return (
    <PageWrapper>
      <PageContainer className="flex-auto flex flex-col items-center">
        <div className="mb-4 w-full md:w-[500px]">
          <Alert title="Early Accessing" color="orange" radius="lg" className="!border !border-orange-200">
            This app is in early development and only supports operations directly with your private-key.
            Please keep your private-key safe and do not share it in any public place.
          </Alert>
        </div>
        <PageCard>
          <div className="mb-4 text-xl font-semibold">Transfer NFT</div>
          <RequestTransferNft />
        </PageCard>
      </PageContainer>
    </PageWrapper>
  );
}
