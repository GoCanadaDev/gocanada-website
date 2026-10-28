// Type declarations for imports TypeScript can't resolve types for on its own.

// The SSR-safe CommonJS build has no .d.ts files; it matches the ES build's API.
declare module "instantsearch.js/cjs/lib/routers/index.js" {
  export { history } from "instantsearch.js/es/lib/routers"
}
