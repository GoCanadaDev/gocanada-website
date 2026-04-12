import { client } from "~/sanity/client"
import { SiteConfigType, getSiteConfig } from "~/sanity/queries/siteConfig"
import { loadQueryWithDraft } from "~/sanity/loader.server"
import {
  Category,
  Post,
  PostPreview,
  featuredPostsQuery,
  getCategories,
  postsQuery,
} from "~/sanity/queries"
import { sanityFetchWithTimeout } from "~/lib/sanityFetchWithTimeout"
import { SupportedLanguages } from "~/i18n"
import { sanitizeStrings } from "~/lib/sanitizeStrings"

type FeaturedPostsType = {
  mainPostCarouselCycleTime: number | null
  frontAndCenterPosts: PostPreview[] | null
  featuredPosts: PostPreview[] | null
}

const provinces = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Québec",
  "Saskatchewan",
]

const territories = ["Northwest Territories", "Nunavut", "Yukon"]

const SITE_ORIGIN = "https://gocanada.com"

function buildLlmsTxt({
  featuredPosts,
  categories,
  siteConfig,
}: {
  featuredPosts: FeaturedPostsType
  categories: Category[]
  siteConfig: SiteConfigType
}) {
  // need to backup to "en" if lang is not there for pages like Links which doesn't have a lang in the url
  const lang = "en" as SupportedLanguages

  // Safe access to first category's subcategories (same partition as Navigation)
  const subCategories = categories[0]?.subCategories || []

  const provincesList = subCategories.filter((c) =>
    provinces.includes(c.title[lang])
  )

  const territoriesList = subCategories.filter((c) =>
    territories.includes(c.title[lang])
  )

  const citiesList = subCategories.filter(
    (c) =>
      !provinces.includes(c.title[lang]) && !territories.includes(c.title[lang])
  )

  const categoryNavLines = categories
    .filter((category) => category.enabled && category.title[lang])
    .flatMap((category) => {
      const title = category.title[lang]
      const catSlug = category.slug[lang]
      const categoryBase = `${SITE_ORIGIN}/${lang}/categories/${catSlug}`
      const subLink = (subSlug: string) => `${categoryBase}/${subSlug}`

      const header = [`## ${title}`, ``]

      if (title === "Destinations") {
        return [
          ...header,
          `### By Province`,
          ``,
          ...provincesList
            .sort((a, b) => a.title[lang].localeCompare(b.title[lang]))
            .map((sub) => `- [${sub.title[lang]}](${subLink(sub.slug[lang])})`),
          ``,
          `### By Territory`,
          ``,
          ...territoriesList
            .sort((a, b) => a.title[lang].localeCompare(b.title[lang]))
            .map((sub) => `- [${sub.title[lang]}](${subLink(sub.slug[lang])})`),
          ``,
          `### By City`,
          ``,
          ...citiesList
            .filter((subCategory) => subCategory.enabledInNav !== false)
            .map((sub) => `- [${sub.title[lang]}](${subLink(sub.slug[lang])})`),
          ``,
          `### Anywhere`,
          ``,
          `- [All of Canada](${categoryBase})`,
          ``,
        ]
      }

      return [
        ...header,
        ...(category.subCategories?.map(
          (sub) => `- [${sub.title[lang]}](${subLink(sub.slug[lang])})`
        ) ?? []),
        ``,
      ]
    })

  const lines = [
    `# ${siteConfig.siteTitle}`,
    ``,
    `> ${siteConfig.siteTitleDescription}`,
    `> ${siteConfig.footerText}`,
    ``,
    ...categoryNavLines,
    ``,
    `## Featured Posts`,
    ``,
    ...(featuredPosts.frontAndCenterPosts?.map((p) => {
      const slug = p.slug[lang] as string
      const href = `${SITE_ORIGIN}/${lang}/${slug}.md`
      return `- [${p.title[lang]}](${href}): ${p.excerpt[lang]}`
    }) ?? []),
    ...(featuredPosts.featuredPosts?.map((p) => {
      const slug = p.slug[lang] as string
      const href = `${SITE_ORIGIN}/${lang}/${slug}.md`
      return `- [${p.title[lang]}](${href}): ${p.excerpt[lang]}`
    }) ?? []),
    ``,
    `## Optional`,
    ``,
    `- [About](${SITE_ORIGIN}/${lang}/about): Learn more about Go Canada: our editorial mission, how we cover Canada travel, and the resources we create to help you plan memorable trips.`,
    `- [Advertising](${SITE_ORIGIN}/${lang}/advertising): Partner with Go Canada to reach engaged travelers planning trips across Canada. Request our media kit, rate card, and sponsorship options.`,
    `- [Contact](${SITE_ORIGIN}/${lang}/contact): Contact Go Canada for story submissions, media inquiries, advertising opportunities, or general questions.`,
    `- [Instagram](https://instagram.com/canada): Follow Go Canada on Instagram for the latest Canada travel news, tips, and inspiration.`,
    `- [Stay & Wander](https://www.stayandwander.com/): Go Canada is a division of Stay & Wander Media Inc., visit our website to learn more.`,
  ]

  return lines.join("\n")
}

export async function loader() {
  // Fetch all Sanity data with timeout protection and fallbacks
  // Use Promise.allSettled to allow partial success if some queries fail
  const [categoriesResult, siteConfigResult] = await Promise.allSettled([
    sanityFetchWithTimeout(
      () => getCategories(client, "en"),
      8000,
      [] as Category[]
    ),
    sanityFetchWithTimeout(
      () => getSiteConfig(client),
      8000,
      {} as SiteConfigType
    ),
  ])

  // Extract values or use fallbacks
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : []
  const siteConfig =
    siteConfigResult.status === "fulfilled" ? siteConfigResult.value : {}

  const posts = await loadQueryWithDraft(
    postsQuery,
    {
      language: "en",
    },
    false
  ).then((res) => ({
    ...res,
    data: res.data ? (res.data as Post[]) : null,
  }))

  if (!posts.data) {
    throw new Response("Posts Not found", { status: 404 })
  }

  const featuredPosts = await loadQueryWithDraft(
    featuredPostsQuery,
    {
      language: "en",
    },
    false
  ).then((res) => ({
    ...res,
    data: res.data ? (res.data as FeaturedPostsType) : null,
  }))

  if (!featuredPosts.data) {
    throw new Response("Featured Posts Not found", { status: 404 })
  }

  const body = buildLlmsTxt({
    featuredPosts: sanitizeStrings(featuredPosts.data),
    categories,
    siteConfig: siteConfig as SiteConfigType,
  })

  return new Response(body, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "text/plain; charset=utf-8",
      "Netlify-CDN-Cache-Control": "public, durable, s-maxage=31536000",
      "Cache-Tag":
        "llms-txt, posts, categories, siteConfig, featuredPostsConfig",
    },
  })
}
