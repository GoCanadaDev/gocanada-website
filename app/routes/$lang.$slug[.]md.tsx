import type { LoaderFunctionArgs } from "@remix-run/node"
import { portableTextToMarkdown } from "@portabletext/markdown"
import invariant from "tiny-invariant"

import { sanitizeStrings } from "~/lib/sanitizeStrings"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { Post, postBySlugQuery } from "~/sanity/queries"
import { loadQueryWithDraft } from "~/sanity/loader.server"
import { getDraftMode } from "~/sanity/get-draft-mode.server"

const SITE_ORIGIN = "https://gocanada.com"

/** Minimal YAML scalars for LLM-facing exports (no extra dependency). */
function yamlDoubleQuotedString(s: string): string {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`
}

/** Collapse 2+ consecutive blank lines into one (avoids holes left after stripping images). */
function normalizeConsecutiveBlankLines(markdown: string): string {
  const closeIdx = markdown.indexOf("\n---\n", 4)
  if (closeIdx === -1) {
    return markdown.replace(/\n{3,}/g, "\n\n")
  }
  const afterFrontmatter = closeIdx + "\n---\n".length
  return (
    markdown.slice(0, afterFrontmatter) +
    markdown.slice(afterFrontmatter).replace(/\n{3,}/g, "\n\n")
  )
}

function localized(post: Post, value: { en: string; fr: string }) {
  return value[post.language]
}

function postCanonicalUrl(post: Post): string {
  const lang = post.language
  return `${SITE_ORIGIN}/${lang}/${String(post.slug[lang])}`
}

function buildYamlFrontmatter(post: Post): string {
  const lang = post.language
  const title = localized(post, post.title)
  const slug = String(post.slug[lang])
  const url = postCanonicalUrl(post)

  const authorName =
    typeof post.author.name === "string"
      ? post.author.name
      : String(post.author.name ?? "TBD")

  const lines: string[] = ["---"]

  lines.push(`title: ${yamlDoubleQuotedString(title)}`)
  lines.push(`author: ${yamlDoubleQuotedString(authorName)}`)
  lines.push(`language: ${lang}`)
  lines.push(`slug: ${yamlDoubleQuotedString(slug)}`)
  lines.push(`url: ${yamlDoubleQuotedString(url)}`)

  lines.push(`published_at: ${yamlDoubleQuotedString(post.publishedAt)}`)
  lines.push(`updated_at: ${yamlDoubleQuotedString(post._updatedAt)}`)
  lines.push(`created_at: ${yamlDoubleQuotedString(post._createdAt)}`)

  const excerpt = localized(post, post.excerpt)
  if (excerpt.trim()) {
    lines.push("excerpt: |")
    for (const line of excerpt.split(/\r?\n/)) {
      lines.push(`  ${line}`)
    }
  }

  if (post.categories?.length) {
    lines.push("categories:")
    for (const c of post.categories) {
      lines.push(
        `  - name: ${yamlDoubleQuotedString(localized(post, c.title))}`
      )
      lines.push(`    slug: ${yamlDoubleQuotedString(String(c.slug[lang]))}`)
    }
  }

  if (post.subCategories?.length) {
    lines.push("subcategories:")
    for (const s of post.subCategories) {
      lines.push(
        `  - name: ${yamlDoubleQuotedString(localized(post, s.title))}`
      )
      lines.push(`    slug: ${yamlDoubleQuotedString(String(s.slug[lang]))}`)
    }
  }

  if (post.tags?.length) {
    lines.push("tags:")
    for (const t of post.tags) {
      lines.push(
        `  - name: ${yamlDoubleQuotedString(localized(post, t.title))}`
      )
      lines.push(`    slug: ${yamlDoubleQuotedString(String(t.slug[lang]))}`)
    }
  }

  if (post.isSponsored) {
    lines.push("sponsored: true")
    if (post.sponsoredText) {
      lines.push(
        `sponsored_text: ${yamlDoubleQuotedString(post.sponsoredText)}`
      )
    }
  }

  lines.push("---")
  return lines.join("\n")
}

function portableTextMarkdownOptions() {
  const embedUrl = (url: string) => `\n\n${url}\n\n`

  return {
    types: {
      subscribeFormType: () => "",
      inlineAdType: ({ value }: { value: { adUrl?: string } }) =>
        value.adUrl ? `\n\n[Advertisement](${value.adUrl})\n\n` : "",
      facebookPostType: ({ value }: { value: { url: string } }) =>
        embedUrl(value.url),
      instagramPostType: ({ value }: { value: { url: string } }) =>
        embedUrl(value.url),
      linkedinPostType: ({ value }: { value: { url: string } }) =>
        embedUrl(value.url),
      pinterestPostType: ({ value }: { value: { url: string } }) =>
        embedUrl(value.url),
      tiktokPostType: ({ value }: { value: { url: string } }) =>
        embedUrl(value.url),
      twitterPostType: ({ value }: { value: { url: string } }) =>
        embedUrl(value.url),
      youTubePostType: ({ value }: { value: { url: string } }) =>
        embedUrl(value.url),
      image: () => "",
      galleryType: () => "",
      horizontalRuleType: () => "\n\n---\n\n",
    },
    unknownType: () => "",
  } satisfies NonNullable<Parameters<typeof portableTextToMarkdown>[1]>
}

function postToMarkdown(post: Post): string {
  const lang = post.language
  const title = localized(post, post.title)

  const sections: string[] = []

  sections.push(buildYamlFrontmatter(post), "")

  sections.push(`# ${title}`, "")

  const mdOpts = portableTextMarkdownOptions()

  if (post.byline?.length) {
    sections.push(portableTextToMarkdown(post.byline, mdOpts), "", "---", "")
  }

  sections.push(portableTextToMarkdown(post.body, mdOpts), "")

  const canonicalUrl = postCanonicalUrl(post)
  sections.push("---", "", `Source: [${canonicalUrl}](${canonicalUrl})`, "")

  return normalizeConsecutiveBlankLines(sections.join("\n").trimEnd() + "\n")
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  invariant(params.slug, "Expected slug param")
  isLangSupportedLang(params.lang)

  const isDraftMode = await getDraftMode(request)

  const post = await loadQueryWithDraft(
    postBySlugQuery,
    {
      slug: params.slug,
      language: params.lang,
    },
    isDraftMode
  ).then((res) => ({
    ...res,
    data: res.data ? (res.data as Post) : null,
  }))

  if (post.data === null) {
    throw new Response(null, {
      status: 404,
      statusText: "Post Not Found",
    })
  }

  const postData = sanitizeStrings(post.data)
  const markdown = postToMarkdown(postData)

  return new Response(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Netlify-CDN-Cache-Control": "public, s-maxage=31536000",
      "Cache-Tag": `posts:id:${postData._id}`,
    },
  })
}
