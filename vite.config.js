import { sentryVitePlugin } from "@sentry/vite-plugin"
import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import netlifyPlugin from "@netlify/vite-plugin-react-router"
import commonjs from "vite-plugin-commonjs"

export default defineConfig({
  serverDependenciesToBundle: ["accept-language-parser", "react-router-dom"],
  define: {
    "process.env": {
      SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
      SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
      SANITY_STUDIO_API_VERSION: process.env.SANITY_STUDIO_API_VERSION,
      SANITY_STUDIO_URL: process.env.SANITY_STUDIO_URL,
      SANITY_STUDIO_USE_STEGA: process.env.SANITY_STUDIO_USE_STEGA,
      SANITY_SESSION_SECRET: process.env.SANITY_SESSION_SECRET,
      SANITY_READ_TOKEN: process.env.SANITY_READ_TOKEN,
      ALGOLIA_APPLICATION_ID: process.env.ALGOLIA_APPLICATION_ID,
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
      ALGOLIA_ADMIN_API_KEY: "",
      FACEBOOK_PIXEL_ID: process.env.FACEBOOK_PIXEL_ID,
      GTAG_ID: process.env.GTAG_ID,
    },
    global: {},
  },
  resolve: {
    preserveSymlinks: true,
    alias: {},
    // alias: {
    //   stream: "stream-browserify",
    //   buffer: "buffer",
    //   util: "util",
    //   process: "process/browser",
    // },
  },
  ssr: {
    // Ensure these module aren't bundled for SSR
    noExternal: [
      "accept-language-parser",
      "use-sound",
      "@remix-run/react",
      "react-router-dom",
      "@sanity/ui",
      "sanity-plugin-media",
      "@sanity/icons",
      "styled-components",
      "@sanity/block-tools",
      "@reduxjs/toolkit",
      "rxjs",
      "react-dropzone",
      "i18next-fs-backend",
    ],
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
  plugins: [
    netlifyPlugin({
      appDirectory: "app",
      // Add these specific configurations
      future: {
        v7_partialHydration: true,
        v7_relativeSplatPath: true,
      },
    }),
    reactRouter({
      future: {
        v7_partialHydration: true,
        v7_relativeSplatPath: true,
      },
    }),
    tsconfigPaths(),
    sentryVitePlugin({
      org: "tonymamo",
      project: "gocanada",
    }),
    commonjs(),
  ],

  optimizeDeps: {
    include: [
      "react-router",
      "@react-router/node",
      "react-router-dom",
      "@react-router/dom",
      "@react-router/server",
    ],
    exclude: ["react-router-dom/server", "@resvg/resvg-js"],
  },

  build: {
    target: "esnext", // For top-level await support
    sourcemap: false,
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
})
