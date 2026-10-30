// Drafts alt text with Claude for images that are missing it (the same images
// scripts/report-missing-alt-text.ts lists) and saves it into each document's
// draft, never the published version. Editors then review the drafted alt
// text in the Studio and publish. Until they do, the report keeps listing
// those images, so it doubles as the review queue.
//
// Dry run by default: prints the drafted alt text without saving. Pass
// --write to save, and --limit N to stop after N images. Try a small batch
// first:
//
//   node --env-file=.env --experimental-strip-types scripts/draft-alt-text.ts --limit 10
//   node --env-file=.env --experimental-strip-types scripts/draft-alt-text.ts --write
//
// Needs ANTHROPIC_API_KEY and SANITY_WRITE_TOKEN in .env.

import Anthropic from "@anthropic-ai/sdk"
import createImageUrlBuilder from "@sanity/image-url"

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
  SANITY_WRITE_TOKEN,
} = process.env

const write = process.argv.includes("--write")
const limitArg = process.argv.indexOf("--limit")
const limit = limitArg === -1 ? Infinity : Number(process.argv[limitArg + 1])
const CONCURRENCY = 4

type SanityDocument = PostImages & {
  _id: string
  _type: "postType" | "staticPageType"
  _rev: string
  title?: { en?: string }
  excerpt?: { en?: string }
  body?: BlockContent | { en?: BlockContent; fr?: BlockContent } | null
  [key: string]: unknown
}

const sanityApi = `https://${SANITY_STUDIO_PROJECT_ID}.api.sanity.io/v${SANITY_STUDIO_API_VERSION}/data`
const sanityHeaders = {
  Authorization: `Bearer ${SANITY_WRITE_TOKEN}`,
  "Content-Type": "application/json",
}

async function sanity(path: string, init?: RequestInit) {
  const res = await fetch(`${sanityApi}${path}`, {
    ...init,
    headers: sanityHeaders,
  })
  if (!res.ok) throw new Error(`Sanity ${res.status}: ${await res.text()}`)
  return res.json()
}

// Published documents and their drafts. Drafting only covers documents that
// have been published, which is the backlog the validation warns about.
const query = `*[_type in ["postType", "staticPageType"] && !(_id in path("versions.**"))]`
const { result: allDocuments }: { result: SanityDocument[] } = await sanity(
  `/query/${SANITY_STUDIO_DATASET}?perspective=raw&query=${encodeURIComponent(query)}`
)

const drafts = new Map(
  allDocuments
    .filter(({ _id }) => _id.startsWith("drafts."))
    .map((draft) => [draft._id.replace("drafts.", ""), draft])
)
const published = allDocuments.filter(({ _id }) => !_id.startsWith("drafts."))

// Scan the draft when there is one, so we don't overwrite alt text an editor
// has already typed or patch images they've since removed.
function findMissing(document: SanityDocument): MissingAltImage[] {
  if (document._type === "postType") {
    return findPostImagesMissingAlt(document)
  }
  const body = document.body as { en?: BlockContent; fr?: BlockContent }
  return [
    ...findBlockImagesMissingAlt("Body (EN)", "body.en", body?.en),
    ...findBlockImagesMissingAlt("Body (FR)", "body.fr", body?.fr),
  ]
}

let remaining = limit
const work = published.flatMap((publishedDocument) => {
  const draft = drafts.get(publishedDocument._id)
  const missing = findMissing(draft ?? publishedDocument).slice(0, remaining)
  remaining -= missing.length
  return missing.length > 0 ? [{ publishedDocument, draft, missing }] : []
})

console.log(
  `Drafting alt text for ${work.reduce((n, { missing }) => n + missing.length, 0)} images across ${work.length} documents${write ? "" : " (dry run)"}`
)

const anthropic = new Anthropic({ maxRetries: 5 })
const imageUrl = createImageUrlBuilder({
  projectId: SANITY_STUDIO_PROJECT_ID!,
  dataset: SANITY_STUDIO_DATASET!,
})

const SYSTEM_PROMPT = `You write alt text for photos on Go Canada, a Canadian travel and lifestyle publication. Readers using screen readers hear your alt text in place of the image.

Write one plain sentence, under 125 characters, describing what the photo shows that matters to the article. You'll get the text around the photo in the article. Use it only to identify what is visible, such as naming the place, landmark, or dish when the text makes clear that's what the photo shows. Never mention anything you can't see in the photo, even if the text talks about it, and when the text doesn't settle what something is, describe what is visible instead. Don't start with "Image of" or "Photo of", don't repeat the caption word for word, and don't add opinions. If the image is mostly text, such as a logo, poster, or menu, give the gist of the text.

Reply with the alt text only, in English, with no quotes.`

type Article = { title: string; excerpt?: string }

// The main and secondary images have no text around them, so they get the
// article's excerpt instead.
function describeSurroundings(article: Article, image: MissingAltImage) {
  const isLeadImage = !image.path.includes("[")
  return [
    `Article title: ${article.title}`,
    isLeadImage && article.excerpt && `Article summary: ${article.excerpt}`,
    image.context?.heading && `Section heading: ${image.context.heading}`,
    image.context?.before && `Text before the photo: ${image.context.before}`,
    image.context?.after && `Text after the photo: ${image.context.after}`,
    image.caption && `Caption: ${image.caption}`,
  ]
    .filter(Boolean)
    .join("\n")
}

async function draftAltText(
  article: Article,
  image: MissingAltImage
): Promise<string | null> {
  const response = await anthropic.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    output_config: { effort: "low" },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "url",
              url: imageUrl
                .image(image.assetRef)
                .width(1024)
                .fit("max")
                .format("jpg")
                .url(),
            },
          },
          {
            type: "text",
            text: describeSurroundings(article, image),
          },
        ],
      },
    ],
  })

  if (response.stop_reason === "refusal") return null
  const text = response.content
    .flatMap((block) => (block.type === "text" ? [block.text] : []))
    .join(" ")
    .trim()
    .replace(/^["“]|["”]$/g, "")
  return text || null
}

// Runs `task` over `items` with at most CONCURRENCY in flight.
async function mapConcurrently<T, R>(
  items: T[],
  task: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < items.length) {
        const index = next++
        results[index] = await task(items[index])
      }
    })
  )
  return results
}

let drafted = 0
let failed = 0

for (const { publishedDocument, draft, missing } of work) {
  const article = {
    title: publishedDocument.title?.en ?? publishedDocument._id,
    excerpt: (draft ?? publishedDocument).excerpt?.en,
  }
  console.log(`\n${article.title}`)

  const altTexts = await mapConcurrently(missing, async (image) => {
    try {
      return await draftAltText(article, image)
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        console.error(`  ! ${image.location}: Claude API ${error.status}`)
        return null
      }
      throw error
    }
  })

  const set: Record<string, string> = {}
  for (const [index, image] of missing.entries()) {
    const alt = altTexts[index]
    if (alt) {
      set[`${image.path}.alt`] = alt
      console.log(`  - ${image.location}: ${alt}`)
    } else {
      failed++
      console.log(`  ! ${image.location}: no alt text drafted, skipped`)
    }
  }
  drafted += Object.keys(set).length

  if (!write || Object.keys(set).length === 0) continue

  // Save into the draft. Without one, create it from the published document,
  // keeping _createdAt so the Studio still treats it as an existing document.
  // With one, ifRevisionID makes the save fail rather than clobber an editor
  // who changed the draft while Claude was drafting.
  const draftId = `drafts.${publishedDocument._id}`
  const { _rev, _updatedAt, ...publishedFields } = publishedDocument
  const mutations = draft
    ? [{ patch: { id: draftId, ifRevisionID: draft._rev, set } }]
    : [
        { createIfNotExists: { ...publishedFields, _id: draftId } },
        { patch: { id: draftId, set } },
      ]

  try {
    await sanity(`/mutate/${SANITY_STUDIO_DATASET}`, {
      method: "POST",
      body: JSON.stringify({ mutations }),
    })
  } catch (error) {
    failed += Object.keys(set).length
    drafted -= Object.keys(set).length
    console.error(`  ! Not saved: ${(error as Error).message}`)
  }
}

console.log(
  `\n${drafted} alt texts drafted${write ? " and saved to drafts" : " (dry run, nothing saved)"}, ${failed} skipped`
)
