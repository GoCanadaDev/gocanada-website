import { config } from "@netlify/remix-adapter"

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ...(process.env.NODE_ENV === "production" ? config : undefined),
  serverDependenciesToBundle: [
    "remix-i18next",
    "accept-language-parser",
    "use-sound",
  ],
  // Add HMR configuration
  devServerPort: 3000,
  devServerBroadcastDelay: 1000,
  // This works out of the box with the Netlify adapter, but you can
  // add your own custom config here if you want to.
  //
  // See https://remix.run/file-conventions/remix-config
}
