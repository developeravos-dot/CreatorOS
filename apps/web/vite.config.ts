import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
  ],

  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,

    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
  },
});
