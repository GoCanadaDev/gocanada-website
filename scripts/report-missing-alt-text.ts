// Lists published posts with images (main, secondary, inline body/byline and
// gallery images) that are missing alt text, so editors can fill in the
// backlog. Read-only.
//
//   node --env-file=.env --experimental-strip-types scripts/report-missing-alt-text.ts

import {
  findPostImagesMissingAlt,
  type PostImages,
} from "../app/lib/imageAlt.ts"

const {
  SANITY_STUDIO_PROJECT_ID,
  SANITY_STUDIO_DATASET,
  SANITY_STUDIO_API_VERSION,
  SANITY_STUDIO_URL,
} = process.env

const query = `*[_type == "postType" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(publishedAt desc){
  _id,
  "title": title.en,
  "slug": slug.en.current,
  mainImage,
  secondaryImage,
  body,
  byline,
}`

type PostRow = PostImages & { _id: string; title: string; slug: string }

const sanityUrl = `https://${SANITY_STUDIO_PROJECT_ID}.api.sanity.io/v${SANITY_STUDIO_API_VERSION}/data/query/${SANITY_STUDIO_DATASET}?query=${encodeURIComponent(query)}`
const res = await fetch(sanityUrl)
if (!res.ok) throw new Error(`Sanity ${res.status}: ${await res.text()}`)
const { result: posts }: { result: PostRow[] } = await res.json()

let imageCount = 0
const postsMissingAlt = posts
  .map((post) => ({ post, missing: findPostImagesMissingAlt(post) }))
  .filter(({ missing }) => missing.length > 0)

for (const { post, missing } of postsMissingAlt) {
  imageCount += missing.length
  console.log(`\n${post.title} (/${post.slug})`)
  console.log(`  ${SANITY_STUDIO_URL}/intent/edit/id=${post._id};type=postType`)
  missing.forEach(({ location, assetRef }) =>
    console.log(`  - ${location}: ${assetRef}`)
  )
}

console.log(
  `\n${imageCount} images missing alt text across ${postsMissingAlt.length} of ${posts.length} published posts`
)
