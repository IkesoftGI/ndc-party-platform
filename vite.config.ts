// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),

    // ✅ Progressive Web App (PWA) Setup — Refactored for NDC
    VitePWA({
      registerType: "autoUpdate",
      strategies: "generateSW",
      injectRegister: "auto",
      manifestFilename: "manifest.webmanifest",

      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "ndc-logo.png", // ✅ Updated logo
      ],

      manifest: {
        name: "NDC Party Platform",
        short_name: "NDC Platform",
        description:
          "The official digital platform of the National Democratic Congress (NDC) — uniting leadership, progress, and vision for Ghana.",
        theme_color: "#00843D", // ✅ NDC Green
        background_color: "#FFFFFF",
        display: "standalone",
        orientation: "portrait-primary",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/ndc-logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/ndc-icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/ndc-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
        runtimeCaching: [
          {
            // ✅ Backend API caching for NDC backend
            urlPattern: /^https:\/\/ndc-backend\.onrender\.com\/api\/users/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 86400, // 1 day
              },
            },
          },
          {
            // ✅ Image caching
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
              },
            },
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@data": path.resolve(__dirname, "src/data"),
      "@api": path.resolve(__dirname, "src/api"),
      "@context": path.resolve(__dirname, "src/context"),
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/health": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

    build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom"))
            return "react-vendor";
          if (id.includes("node_modules/react-bootstrap")) return "bootstrap";
          if (id.includes("node_modules/lodash")) return "lodash";
          if (id.includes("src/data/blogPosts")) return "blogData";
          if (id.includes("/src/pages/")) {
            const parts = id.split("/");
            const pageIndex = parts.indexOf("pages");
            const pageName = parts[pageIndex + 1];
            return `page-${pageName}`;
          }
        },
      },
    },
  },

  // ✅ Add this block below build
  preview: {
    port: 4175, // Custom preview port for NDC Party Platform
    strictPort: true,
    open: true, // Automatically opens the browser when preview starts
  },
});
