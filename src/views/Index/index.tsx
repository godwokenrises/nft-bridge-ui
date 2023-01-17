import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { HomeLayout } from "@/components/HomeLayout";
import { Async } from "@/components/Loader";

const TransferCkbPage = () => <Async factory={() => import("../TransferCkb")} prop="TransferCkbPage" />;
const TransferNftPage = () => <Async factory={() => import("../TransferNft")} prop="TransferNftPage" />;
const DepositNftPage = () => <Async factory={() => import("../DepositNft")} prop="DepositNftPage" />;
const NotFoundPage = () => <Async factory={() => import("../Status/NotFound")} prop="NotFoundPage" />;

export function IndexPage() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Navigate to="transfer-ckb" />} />
            <Route path="transfer-ckb" element={<TransferCkbPage />} />
            <Route path="transfer-nft" element={<TransferNftPage />} />
            <Route path="deposit-nft" element={<DepositNftPage />} />
            <Route path="404" element={<NotFoundPage />} />
          </Route>

          <Route path="*" element={<Navigate replace to="/404" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
