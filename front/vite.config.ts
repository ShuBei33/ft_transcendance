import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { dirname } from "path";
import { fileURLToPath } from "url";

const filePath = dirname(fileURLToPath(import.meta.url));
const sassPath = `${filePath}/src/lib/style/`;

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: true,
    port: 5000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "${sassPath}global.scss";`,
      },
    },
  },
});
