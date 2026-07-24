import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@stellar")) return "stellar";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("react")) return "react";
        },
      },
    },
  },
});
