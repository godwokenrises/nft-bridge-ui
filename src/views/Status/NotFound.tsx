import { PageContainer, PageWrapper } from "@/components/Container";
import { InboxOutlined } from "@ricons/antd";
import { Icon } from "@ricons/utils";

export function NotFoundPage() {
  return (
    <PageWrapper>
      <PageContainer className="flex flex-col justify-center items-center select-none">
        <div className="w-24 h-24 text-6xl flex justify-center items-center rounded-full text-gray-500 bg-gray-100">
          <Icon>
            <InboxOutlined />
          </Icon>
        </div>
        <div className="mt-3 text-lg text-gray-600">Not Found</div>
      </PageContainer>
    </PageWrapper>
  );
}
