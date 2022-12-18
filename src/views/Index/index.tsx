import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomeLayout } from "@/components/HomeLayout";
import { Async } from "@/components/Loader";

const TransferPage = () => <Async factory={() => import("../TransferCkb")} prop="TransferCkbPage" />;
const NftBridgePage = () => <Async factory={() => import("../NftBridge")} prop="NftBridgePage" />;
const NotFoundPage = () => <Async factory={() => import("../Status/NotFound")} prop="NotFoundPage" />;

export function IndexPage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Navigate to="transfer-ckb" />} />
          <Route path="transfer-ckb" element={<TransferPage />} />
          <Route path="bridge-nft" element={<NftBridgePage />} />
          <Route path="404" element={<NotFoundPage />} />
        </Route>

        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
    </BrowserRouter>
  );
}
