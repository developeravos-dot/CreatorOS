import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },

  optimizeDeps: {
    esbuildOptions: {
      jsx: "automatic",
    },
  },

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
});
