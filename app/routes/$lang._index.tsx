import type {
  HeadersFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node"
import { Params, useLoaderData } from "@remix-run/react"
import {
  PopupPromoConfig,
  getPopupPromoConfig,
} from "~/sanity/queries/popupPromoConfig"
import {
  Post,
  PostPreview,
  featuredPostsQuery,
  postsQuery,
  trendingPostsQuery,
} from "~/sanity/queries"
import { SiteConfigType, getSiteConfig } from "~/sanity/queries/siteConfig"
import {
  generateBlogSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "~/lib/structuredData"
import { json, redirect } from "@remix-run/node"
import { useEffect, useState } from "react"

import { CardGrid } from "~/components/CardGrid"
import { Layout } from "~/components/Layout"
import { LoadMorePosts } from "~/components/LoadMorePosts"
import MidRollBannerAd from "~/components/MidRollBannerAd"
import PromoPopup from "~/components/PromoPopup"
import { QueryResponseInitial } from "@sanity/react-loader"
import { SupportedLanguages } from "~/i18n"
import { TopGrid } from "~/components/homepage/TopGrid"
import { Trending } from "~/components/homepage/Trending"
import { client } from "~/sanity/client"
import { genericMetaTags } from "~/lib/utils"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { loadQueryWithDraft } from "~/sanity/loader.server"
import { postsCountQuery } from "~/sanity/queries/posts"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { useQuery } from "~/sanity/loader"
import { useTranslation } from "react-i18next"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: IndexLoaderData
}) => {
  const title = `${data.siteConfig.siteTitle} | ${data.siteConfig.siteTitleDescription}`
  const description = data.siteConfig.siteDescription
  const canonical = `https://gocanada.com/${data.params.lang}`
  return genericMetaTags({
    title,
    description,
    canonical,
    schemas: [
      generateOrganizationSchema(),
      generateWebsiteSchema(),
      generateBlogSchema({ description }),
      generateBreadcrumbSchema([
        {
          name: "Home",
          url: canonical,
        },
      ]),
    ],
  })
}

type FeaturedPostsType = {
  mainPostCarouselCycleTime: number | null
  frontAndCenterPosts: PostPreview[] | null
  featuredPosts: PostPreview[] | null
}

type IndexLoaderData = {
  featuredPosts: QueryResponseInitial<FeaturedPostsType | null>
  params: Params
  popupPromoConfig: PopupPromoConfig
  posts: QueryResponseInitial<PostPreview[] | null>
  siteConfig: SiteConfigType
  trendingPosts: QueryResponseInitial<PostPreview[] | null>
  isDraftMode: boolean
}

export const loader: LoaderFunction = async ({ params, request }) => {
  if (!params.lang) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    })
  }

  const staticPages = [
    "terms",
    "privacy",
    "about",
    "contact",
    "advertising",
    "media",
    "search",
    "thewick",
  ]

  // if params.lang is a static page, redirect to the static page
  if (staticPages.includes(params.lang)) {
    return redirect(`/en/${params.lang}`)
  } else {
    isLangSupportedLang(params.lang)
  }

  const isDraftMode = Boolean(
    request.headers.get("referer")?.includes("studio")
  )

  const siteConfig = await getSiteConfig(client)
  const popupPromoConfig = await getPopupPromoConfig(client)

  const posts = await loadQueryWithDraft(
    postsQuery,
    {
      language: params.lang,
    },
    isDraftMode
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
      language: params.lang,
    },
    isDraftMode
  ).then((res) => ({
    ...res,
    data: res.data ? (res.data as FeaturedPostsType) : null,
  }))

  if (!featuredPosts.data) {
    throw new Response("Featured Posts Not found", { status: 404 })
  }

  const trendingPosts = await loadQueryWithDraft(
    trendingPostsQuery,
    {
      language: params.lang,
    },
    isDraftMode
  ).then((res) => ({
    ...res,
    data: res.data ? (res.data as Post[]) : null,
  }))

  if (!trendingPosts.data) {
    throw new Response("Trending Posts Not found", { status: 404 })
  }

  return json<IndexLoaderData>(
    {
      featuredPosts,
      params,
      popupPromoConfig,
      posts,
      siteConfig,
      trendingPosts,
      isDraftMode,
    },
    {
      headers: {
        // Always revalidate in the browser
        "Cache-Control": "public, max-age=0, must-revalidate",
        // Cache for a year in the CDN
        "Netlify-CDN-Cache-Control": "public, durable, s-maxage=31536000",
        // Purge from the cache whenever the posts change
        "Cache-Tag": "posts, popupPromoConfig, adConfigType",
      },
    }
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders

export default function Index() {
  const {
    posts,
    featuredPosts,
    trendingPosts,
    params,
    popupPromoConfig,
    isDraftMode,
  } = useLoaderData<IndexLoaderData>()
  const {
    i18n: { language },
  } = useTranslation()
  const currentLang = language as SupportedLanguages
  const [displayedPosts, setDisplayedPosts] = useState<PostPreview[]>([])
  const [totalPostsCount, setTotalPostsCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const result = await client.fetch(postsCountQuery, {
          language: params.lang,
        })
        setTotalPostsCount(result?.total || 0)
      } catch (error) {
        console.error("Posts count error:", error)
      }
    }
    fetchCount()
  }, [params.lang])

  const { data: postsData, loading } = useQuery<PostPreview[] | null>(
    postsQuery,
    { language: params.lang },
    {
      initial: posts as unknown as QueryResponseInitial<PostPreview[] | null>,
    }
  )

  const { data: featuredPostsData, loading: featuredPostsLoading } = useQuery<{
    featuredPosts: PostPreview[] | null
    frontAndCenterPosts: PostPreview[] | null
    mainPostCarouselCycleTime: number | null
  }>(
    featuredPostsQuery,
    { language: params.lang },
    {
      initial: featuredPosts as unknown as undefined,
    }
  )

  const { data: trendingPostsData, loading: trendingPostsLoading } = useQuery<{
    trendingPosts: PostPreview[] | null
  }>(
    trendingPostsQuery,
    { language: params.lang },
    {
      initial: trendingPosts as unknown as undefined,
    }
  )

  const sanitizedFrontAndCenterPosts = sanitizeStrings(
    featuredPostsData?.frontAndCenterPosts || []
  )
  const sanitizedFeaturedPosts = sanitizeStrings(
    featuredPostsData?.featuredPosts || []
  )
  const sanitizedTrendingPosts = sanitizeStrings(
    trendingPostsData?.trendingPosts || []
  )
  const sanitizedPosts = Object.values(sanitizeStrings(postsData || []))

  // Initialize displayed posts with first 12 posts
  useEffect(() => {
    if (sanitizedPosts.length > 0 && displayedPosts.length === 0) {
      setDisplayedPosts(sanitizedPosts.slice(0, 12))
    }
  }, [sanitizedPosts])

  const handleLoadMore = (newPosts: PostPreview[]) => {
    setDisplayedPosts((prev) => [...prev, ...newPosts])
  }

  return (
    <Layout translationUrl={currentLang === "en" ? "/fr" : "/en"} useMargins>
      <TopGrid
        featuredPosts={sanitizedFeaturedPosts}
        frontAndCenterPosts={sanitizedFrontAndCenterPosts}
        mainPostCarouselCycleTime={
          featuredPostsData?.mainPostCarouselCycleTime ?? 10
        }
      />
      <MidRollBannerAd />
      <Trending posts={sanitizedTrendingPosts} />
      <CardGrid posts={displayedPosts} />
      {displayedPosts.length < totalPostsCount && displayedPosts.length > 0 && (
        <LoadMorePosts
          lastPostId={displayedPosts[displayedPosts.length - 1]?._id}
          lastPostPublishedAt={
            displayedPosts[displayedPosts.length - 1]?.publishedAt
          }
          language={params.lang ?? "en"}
          onPostsLoaded={handleLoadMore}
          currentCount={displayedPosts.length}
          totalCount={totalPostsCount}
        />
      )}
      {popupPromoConfig.popupPromoEnabled && (
        <PromoPopup config={popupPromoConfig} />
      )}
    </Layout>
  )
}
