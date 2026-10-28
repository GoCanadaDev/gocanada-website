// Type declarations for imports TypeScript can't resolve types for on its own.

// The SSR-safe CommonJS build has no .d.ts files; it matches the ES build's API.
declare module "instantsearch.js/cjs/lib/routers/index.js" {
  export { history } from "instantsearch.js/es/lib/routers"
}

// Our fork ships dist/index.d.ts, but its package.json "exports" map has no
// "types" condition, so TypeScript can't find it. Mirrors those types.
declare module "sanity-algolia" {
  import type { SearchIndex } from "algoliasearch"

  type DocumentStub = Record<string, any> & {
    _id: string
    _type: string
    _rev: string
  }
  type IndexMap = Record<string, { index: SearchIndex; projection?: string }>
  type SanityApiClient = {
    fetch: (query: string, params?: any) => Promise<DocumentStub[]>
  }
  type WebhookBody = {
    ids: { created: string[]; updated: string[]; deleted: string[] }
  }

  export function flattenBlocks(
    blocks: Record<string, any>[],
    removeStopWords?: boolean
  ): string
  export const indexMapProjection: (indexMap: IndexMap) => string

  export default function indexer(
    typeIndexMap: IndexMap,
    serializer: (document: DocumentStub) => Readonly<Record<string, any>>,
    visible?: (document: DocumentStub) => boolean
  ): {
    transform: (
      documents: DocumentStub[]
    ) => Promise<Readonly<Record<string, any>>[]>
    webhookSync: (client: SanityApiClient, body: WebhookBody) => Promise<void>
  }
}
