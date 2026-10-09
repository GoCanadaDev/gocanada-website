// Finds published posts that are missing from the Algolia "posts" index and
// pushes them. Dry run by default; pass --write to actually save.
//
//   node --env-file=.env --experimental-strip-types scripts/backfill-algolia.ts [--write]

import { toAlgoliaPostRecord } from "../app/algolia/records.ts"

const {
  SANITY_STUDIO_PROJECT_ID,
  SANITY_STUDIO_DATASET,
  SANITY_STUDIO_API_VERSION,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_ADMIN_API_KEY,
} = process.env

const write = process.argv.includes("--write")

// Keep in sync with algoliaPostsProjection in app/sanity/queries/posts.ts
const query = `*[_type == "postType" && !(_id in path("drafts.**"))]{
  "objectID": _id,
  "title": title.en,
  "slug": slug.en.current,
  mainImage{
    "id": asset._ref,
    "preview": asset->metadata.lqip,
    "aspectRatio": asset->metadata.dimensions.aspectRatio,
  },
  "excerpt": excerpt.en,
  "body": body[_type == "block" && style == "normal"]{
    "text": children[].text
  }[].text[],
  "author": {
    "name": author->name,
    "slug": author->slug.current,
  },
  "categories": categories[]->{
    "title": title.en,
    "slug": slug.en.current,
  },
}`

const algoliaHeaders = {
  "X-Algolia-Application-Id": ALGOLIA_APPLICATION_ID!,
  "X-Algolia-API-Key": ALGOLIA_ADMIN_API_KEY!,
  "Content-Type": "application/json",
}

async function algolia(path: string, body: unknown) {
  const res = await fetch(
    `https://${ALGOLIA_APPLICATION_ID}.algolia.net/1/indexes${path}`,
    { method: "POST", headers: algoliaHeaders, body: JSON.stringify(body) }
  )
  if (!res.ok) throw new Error(`Algolia ${res.status}: ${await res.text()}`)
  return res.json()
}

const sanityUrl = `https://${SANITY_STUDIO_PROJECT_ID}.api.sanity.io/v${SANITY_STUDIO_API_VERSION}/data/query/${SANITY_STUDIO_DATASET}?query=${encodeURIComponent(query)}`
const { result: posts } = await (await fetch(sanityUrl)).json()

const { results } = await algolia("/*/objects", {
  requests: posts.map((post: { objectID: string }) => ({
    indexName: "posts",
    objectID: post.objectID,
    attributesToRetrieve: ["objectID"],
  })),
})
const indexed = new Set(results.filter(Boolean).map((r: any) => r.objectID))
const missing = posts.filter((post: any) => !indexed.has(post.objectID))

console.log(`${posts.length} posts in Sanity, ${missing.length} missing from Algolia`)
missing.forEach((post: any) => console.log(`  - ${post.slug}`))

if (missing.length === 0) process.exit(0)

if (!write) {
  console.log("\nDry run. Re-run with --write to index these.")
  process.exit(0)
}

const records = missing.map(toAlgoliaPostRecord)
const { taskID } = await algolia("/posts/batch", {
  requests: records.map((body: unknown) => ({ action: "updateObject", body })),
})
console.log(`\nSaved ${records.length} records (task ${taskID}).`)
