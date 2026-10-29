// Lists published posts and static pages with images that are missing alt
// text, so editors can fill in the backlog. Read-only. Covers what the Studio
// validation requires: a post's main, secondary, inline body/byline and
// gallery images, and a static page's inline and gallery body images.
//
//   node --env-file=.env --experimental-strip-types scripts/report-missing-alt-text.ts

import {
  type BlockContent,
  findBlockImagesMissingAlt,
  findPostImagesMissingAlt,
  type MissingAltImage,
  type PostImages,
} from "../app/lib/imageAlt.ts"

const {
  SANITY_STUDIO_PROJECT_ID,
  SANITY_STUDIO_DATASET,
  SANITY_STUDIO_API_VERSION,
  SANITY_STUDIO_URL,
} = process.env

const published = `!(_id in path("drafts.**")) && !(_id in path("versions.**"))`

const query = `{
  "posts": *[_type == "postType" && ${published}] | order(publishedAt desc){
    _id,
    "title": title.en,
    "slug": slug.en.current,
    mainImage,
    secondaryImage,
    body,
    byline,
  },
  "staticPages": *[_type == "staticPageType" && ${published}] | order(route asc){
    _id,
    "title": title.en,
    route,
    body,
  },
}`

type PostRow = PostImages & { _id: string; title: string; slug: string }
type StaticPageRow = {
  _id: string
  title: string
  route: string
  body?: { en?: BlockContent; fr?: BlockContent } | null
}

const sanityUrl = `https://${SANITY_STUDIO_PROJECT_ID}.api.sanity.io/v${SANITY_STUDIO_API_VERSION}/data/query/${SANITY_STUDIO_DATASET}?query=${encodeURIComponent(query)}`
const res = await fetch(sanityUrl)
if (!res.ok) throw new Error(`Sanity ${res.status}: ${await res.text()}`)
const {
  result: { posts, staticPages },
}: { result: { posts: PostRow[]; staticPages: StaticPageRow[] } } =
  await res.json()

function report(
  heading: string,
  documents: {
    title: string
    path: string
    editUrl: string
    missing: MissingAltImage[]
  }[]
) {
  const withMissing = documents.filter(({ missing }) => missing.length > 0)
  const imageCount = withMissing.reduce(
    (n, { missing }) => n + missing.length,
    0
  )

  console.log(`\n## ${heading}`)
  for (const { title, path, editUrl, missing } of withMissing) {
    console.log(`\n${title} (${path})`)
    console.log(`  ${editUrl}`)
    missing.forEach(({ location, assetRef }) =>
      console.log(`  - ${location}: ${assetRef}`)
    )
  }
  console.log(
    `\n${imageCount} images missing alt text across ${withMissing.length} of ${documents.length} published ${heading.toLowerCase()}`
  )
}

const editUrl = (id: string, type: string) =>
  `${SANITY_STUDIO_URL}/intent/edit/id=${id};type=${type}`

report(
  "Posts",
  posts.map((post) => ({
    title: post.title,
    path: `/${post.slug}`,
    editUrl: editUrl(post._id, "postType"),
    missing: findPostImagesMissingAlt(post),
  }))
)

report(
  "Static pages",
  staticPages.map((page) => ({
    title: page.title,
    path: page.route,
    editUrl: editUrl(page._id, "staticPageType"),
    missing: [
      ...findBlockImagesMissingAlt("Body (EN)", page.body?.en),
      ...findBlockImagesMissingAlt("Body (FR)", page.body?.fr),
    ],
  }))
)
