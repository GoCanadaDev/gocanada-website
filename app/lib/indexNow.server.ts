import groq from "groq"

import { client } from "~/sanity/client"

const SITE_ORIGIN = "https://gocanada.com"
const INDEX_NOW_ENDPOINT = "https://api.indexnow.org/indexnow"
// Served by app/routes/indexnow[.]txt.tsx
export const INDEX_NOW_KEY_LOCATION = `${SITE_ORIGIN}/indexnow.txt`

const publishedPostSlugQuery = groq`*[_type == "postType" && _id == $id && !(_id in path("drafts.**")) && !(_id in path("versions.**"))][0].slug.en.current`

export function getIndexNowKey() {
  return process.env.INDEX_NOW_API_KEY?.trim() || undefined
}

// Submits a post's canonical URL to IndexNow so Bing and other IndexNow
// engines recrawl it. Never throws: failures are logged so the publish
// webhook calling this keeps working.
export async function submitPostToIndexNow(id: string) {
  const key = getIndexNowKey()
  if (!key || id.startsWith("drafts.") || id.startsWith("versions.")) {
    return
  }

  try {
    // Bypass the CDN so a just-published post is found
    const slug = await client
      .withConfig({ useCdn: false })
      .fetch<string | null>(publishedPostSlugQuery, { id })
    if (!slug) {
      return
    }

    const url = `${SITE_ORIGIN}/en/${slug}`
    const response = await fetch(INDEX_NOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_ORIGIN).host,
        key,
        keyLocation: INDEX_NOW_KEY_LOCATION,
        urlList: [url],
      }),
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      console.error({
        message: "IndexNow submission failed",
        url,
        status: response.status,
        body: await response.text(),
      })
    }
  } catch (error) {
    console.error({ message: "IndexNow submission error", id, error })
  }
}
