import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin";

// Type augmentation for v3_singleFetch
declare module "@remix-run/server-runtime" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_singleFetch: true,
      },
      serverBundles: ({ branch }) => {
        const isAuthenticatedRoute = branch.some((route) => route.id === "routes/_authenticated");
        return isAuthenticatedRoute ? "authenticated" : "default";
      },
    }),
    tsconfigPaths(),
    netlifyPlugin(),
  ],
  server: {
    port: 3000,
  },
  ssr: {
    noExternal: [
      "remix-i18next",
      "accept-language-parser",
      "use-sound",
    ],
  },
});