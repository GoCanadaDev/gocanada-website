import { sanityFetchWithTimeout } from "~/lib/sanityFetchWithTimeout"
import { client } from "~/sanity/client"
import type { PublishedPostSummary } from "~/sanity/queries"
import { getPublishedPostSummaries } from "~/sanity/queries"
import type { SiteConfigType } from "~/sanity/queries/siteConfig"
import { getSiteConfig } from "~/sanity/queries/siteConfig"

const SITE_ORIGIN = "https://gocanada.com"

function buildLlmsFullTxt({
  posts,
  siteConfig,
}: {
  posts: PublishedPostSummary[]
  siteConfig: SiteConfigType
}) {
  const lang = "en"

  const lines = [
    `# ${siteConfig.siteTitle ?? "Go Canada"}: All Articles`,
    ``,
    `> Every published Go Canada article, newest first. Each link points to a plain-text Markdown copy of the article.`,
    ``,
    `## Articles`,
    ``,
    ...posts.map((p) => {
      const href = `${SITE_ORIGIN}/${lang}/${p.slug}.md`
      return p.excerpt
        ? `- [${p.title}](${href}): ${p.excerpt}`
        : `- [${p.title}](${href})`
    }),
  ]

  return lines.join("\n")
}

export async function loader() {
  // Posts are fetched without a fallback: an empty listing would be cached on
  // the CDN until the next purge, so a failure should error instead
  const [posts, siteConfig] = await Promise.all([
    getPublishedPostSummaries(client),
    sanityFetchWithTimeout(
      () => getSiteConfig(client),
      8000,
      {} as SiteConfigType
    ),
  ])

  const body = buildLlmsFullTxt({ posts, siteConfig })

  return new Response(body, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "text/plain; charset=utf-8",
      "Netlify-CDN-Cache-Control": "public, durable, s-maxage=31536000",
      // "posts" is purged whenever any postType is published or edited
      "Cache-Tag": "llms-full-txt, posts, siteConfig",
    },
  })
}
