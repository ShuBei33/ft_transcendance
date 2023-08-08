import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import SveltePreprocessor from "svelte/compiler";

export default defineConfig({
  plugins: [sveltekit()],

  server: {
    host: true,
    port: 3000,
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/variables.scss" as *;',
      },
    },
  },
});
