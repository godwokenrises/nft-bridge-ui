import { resolve } from "path";
import { defineConfig } from "vite";
import postcss from "./postcss.config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "src") }],
  },
  css: {
    postcss,
  },
  plugins: [react()],
});
