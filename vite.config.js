import { config } from "@netlify/remix-adapter"
import { vitePlugin as remix } from "@remix-run/dev"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import netlifyPlugin from "@netlify/vite-plugin-react-router"

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ...(process.env.NODE_ENV === "production" ? config : undefined),
  serverDependenciesToBundle: [
    "remix-i18next",
    "accept-language-parser",
    "use-sound",
  ],
  plugins: [remix(), tsconfigPaths(), netlifyPlugin()],
  // This works out of the box with the Netlify adapter, but you can
  // add your own custom config here if you want to.
  //
  // See https://remix.run/file-conventions/remix-config
}
