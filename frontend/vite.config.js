import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vercel will deploy both frontend and backend, so no need to proxy to localhost
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // For local development, proxy the /api calls to your backend
      "/api": "http://localhost:5000",
    },
  },
  build: {
    // Set up the base for the app
    base: "/",
  },
});
