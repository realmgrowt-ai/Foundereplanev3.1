import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: [
      ".preview.emergentagent.com",
      ".stage-preview.emergentagent.com",
      ".emergentagent.com",
      ".emergentcf.cloud",
      "localhost"
    ],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
