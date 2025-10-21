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

    // ✅ Progressive Web App (PWA) Setup
    VitePWA({
      // --- core PWA behavior ---
      registerType: "autoUpdate",
      strategies: "generateSW", // ✅ ensures service worker & manifest are generated
      injectRegister: "auto",   // ✅ injects the register script automatically
      manifestFilename: "manifest.webmanifest", // ✅ forces file to appear in /dist

      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "party-platform-logo.png",
      ],

      manifest: {
        name: "NPP Party Platform",
        short_name: "NPP Platform",
        description: "The official Party Platform App for the NPP.",
        theme_color: "#002868", // Party Blue
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/party-platform-logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      // ✅ Enable offline caching & runtime caching
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
        runtimeCaching: [
          {
            // Cache backend API requests
            urlPattern: /^https:\/\/npp-backend\.onrender\.com\/api\/users/,
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
            // Cache images
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
});
