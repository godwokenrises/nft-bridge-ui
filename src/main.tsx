import "./styles/index.css";
import { StrictMode } from "react";
import { IndexPage } from "./views/Index";
import { createRoot } from "react-dom/client";
import { createEmotionCache, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

const root = document.getElementById("root") as HTMLElement;
const emotionCache = createEmotionCache({
  key: "mantine",
  prepend: false,
});

createRoot(root).render(
  <StrictMode>
    <MantineProvider emotionCache={emotionCache}>
      <NotificationsProvider>
        <IndexPage />
      </NotificationsProvider>
    </MantineProvider>
  </StrictMode>,
);
