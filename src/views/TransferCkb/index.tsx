import { PageCard, PageContainer, PageWrapper } from "@/components/Container";
import { useUnipassId } from "@/states/Unipass/useUnipass";
import { ConnectUnipassId } from "@/components/Unipass";

export function TransferCkbPage() {
  const { username } = useUnipassId();

  return (
    <PageWrapper>
      <PageContainer className="flex-auto flex flex-col items-center">
        <PageCard>
          <div className="mb-4 text-xl font-semibold">Transfer CKB</div>

          {!username && (
            <ConnectUnipassId />
          )}


        </PageCard>
      </PageContainer>
    </PageWrapper>
  );
}
