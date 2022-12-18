import { resolve } from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@vitejs/plugin-react";
import postcss from "./postcss.config";

export default defineConfig({
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "src") }],
  },
  css: {
    postcss,
  },
  plugins: [
    nodePolyfills(),
    react(),
  ],
});
