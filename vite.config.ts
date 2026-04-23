import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // When deploying to GitHub Pages the app is served from /<repo-name>/.
  // Set VITE_BASE env var in CI (e.g. /hearts360ai/) or leave unset for local dev.
  base: process.env.VITE_BASE ?? "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      input: {
        // Full HEARTS360 dashboard with React app in the aside panel (default)
        main: path.resolve(__dirname, "index.html"),
        // Standalone React app (narrow panel, mobile-first)
        app: path.resolve(__dirname, "app.html"),
      },
    },
  },
}));
