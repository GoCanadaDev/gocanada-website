import type {
  MetaFunction,
  LoaderFunction,
  HeadersFunction,
} from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Params, useLoaderData } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import {
  Post,
  PostPreview,
  featuredPostsQuery,
  postsQuery,
  trendingPostsQuery,
} from "~/sanity/queries"
import { client } from "~/sanity/client"
import { SupportedLanguages } from "~/i18n"
import { Layout } from "~/components/Layout"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { CardGrid } from "~/components/CardGrid"
import { TopGrid } from "~/components/homepage/TopGrid"
import { Trending } from "~/components/homepage/Trending"
import { getSiteConfig, SiteConfigType } from "~/sanity/queries/siteConfig"
import MidRollBannerAd from "~/components/MidRollBannerAd"
import { useQuery } from "~/sanity/loader"
import { loadQuery } from "~/sanity/loader.server"
import { QueryResponseInitial } from "@sanity/react-loader"
import { genericMetaTags } from "~/lib/utils"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import PromoPopup from "~/components/PromoPopup"
import {
  getPopupPromoConfig,
  PopupPromoConfig,
} from "~/sanity/queries/popupPromoConfig"
import { LoadMorePosts } from "~/components/LoadMorePosts"
import { useState, useEffect } from "react"
import { postsCountQuery, testCountQuery } from "~/sanity/queries/posts"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: IndexLoaderData
}) => {
  const title = `${data.siteConfig.siteTitle} | ${data.siteConfig.siteTitleDescription}`
  const description = data.siteConfig.siteDescription
  return genericMetaTags({
    title,
    description,
    canonical: "/en",
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

  const posts = await loadQuery<Post[] | null>(postsQuery, {
    language: params.lang,
  }).then((res) => ({
    ...res,
    data: res.data ? res.data : null,
  }))

  if (!posts.data) {
    throw new Response("Posts Not found", { status: 404 })
  }

  const featuredPosts = await loadQuery<FeaturedPostsType | null>(
    featuredPostsQuery,
    {
      language: params.lang,
    }
  ).then((res) => ({
    ...res,
    data: res.data ? res.data : null,
  }))

  if (!featuredPosts.data) {
    throw new Response("Featured Posts Not found", { status: 404 })
  }

  const trendingPosts = await loadQuery<Post[] | null>(trendingPostsQuery, {
    language: params.lang,
  }).then((res) => ({
    ...res,
    data: res.data ? res.data : null,
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
    featuredPostsData?.frontAndCenterPosts?.filter((post) =>
      isDraftMode ? true : !post._id.includes("drafts")
    ) || []
  )
  const sanitizedFeaturedPosts = sanitizeStrings(
    featuredPostsData?.featuredPosts?.filter((post) =>
      isDraftMode ? true : !post._id.includes("drafts")
    ) || []
  )
  const sanitizedTrendingPosts = sanitizeStrings(
    trendingPostsData?.trendingPosts?.filter((post) =>
      isDraftMode ? true : !post._id.includes("drafts")
    ) || []
  )
  const sanitizedPosts = Object.values(
    sanitizeStrings(
      (Array.isArray(postsData) &&
        postsData?.filter((post) =>
          isDraftMode ? true : !post._id.includes("drafts")
        )) ||
        []
    )
  )

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
