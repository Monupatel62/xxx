import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Raise chunk warning limit (single-file game is fine at ~60kB)
    chunkSizeWarningLimit: 100,
    rollupOptions: {
      output: {
        // Keep everything in one JS file — fewer HTTP requests
        manualChunks: undefined,
      },
    },
    // Enable minification (default esbuild, very fast)
    minify: "esbuild",
    // Inline small assets directly into JS to save requests
    assetsInlineLimit: 4096,
    // Generate source maps only in dev, not prod (saves bandwidth)
    sourcemap: false,
  },
});
