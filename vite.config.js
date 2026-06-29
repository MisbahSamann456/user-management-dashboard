import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // Vitest config — enables browser-like environment for React testing
    environment: "jsdom",
    globals:     true,
  },
});