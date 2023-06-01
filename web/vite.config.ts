/* eslint-env node */
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  define: {
    "process.env.API_BASE_URL": JSON.stringify(process.env.API_BASE_URL),
  },
  plugins: [react(), svgr()],
  root: "src",
  server: {
    port: process.env.WEB_PORT != null ? +process.env.WEB_PORT : 8000,
  },
});
