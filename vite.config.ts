import { vitePlugin as remix } from "@remix-run/dev"
import { netlifyPlugin } from "@netlify/remix-adapter/plugin"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    sourcemap: "hidden",
  },
  ssr: {
    noExternal: ["remix-i18next", "use-sound"],
  },
  optimizeDeps: {
    exclude: ["i18next-fs-backend", "@resvg/resvg-js", "@sendgrid/client", "@sendgrid/mail"],
  },
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*.css", "**/*.test.{ts,tsx}"],
    }),
    netlifyPlugin(),
    tsconfigPaths(),
  ],
})
