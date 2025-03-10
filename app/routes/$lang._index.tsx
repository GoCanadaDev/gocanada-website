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
}

export const loader: LoaderFunction = async ({ params }) => {
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
    },
    {
      headers: {
        // Always revalidate in the browser
        "Cache-Control": "public, max-age=0, must-revalidate",
        // Cache for a year in the CDN
        "Netlify-CDN-Cache-Control": "public, durable, s-maxage=31536000",
        // Purge from the cache whenever the posts change
        "Cache-Tag": "posts, popupPromoConfig",
      },
    }
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders

export default function Index() {
  const { posts, featuredPosts, trendingPosts, params, popupPromoConfig } =
    useLoaderData<IndexLoaderData>()
  const {
    i18n: { language },
  } = useTranslation()
  const currentLang = language as SupportedLanguages
  const { data: postsData, loading } = useQuery<PostPreview[] | null>(
    postsQuery,
    { language: params.lang },
    {
      initial: posts,
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

  const remainingPosts =
    !loading &&
    !featuredPostsLoading &&
    !trendingPostsLoading &&
    postsData?.filter(
      (post) =>
        !featuredPostsData?.frontAndCenterPosts?.some(
          (featured) => featured._id === post._id
        ) &&
        !featuredPostsData?.featuredPosts?.some(
          (featured) => featured._id === post._id
        ) &&
        !trendingPostsData?.trendingPosts?.some(
          (trending) => trending._id === post._id
        )
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
  const sanitizedRemainingPosts = Object.values(
    sanitizeStrings(remainingPosts || [])
  )

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
      <CardGrid posts={sanitizedRemainingPosts} />
      {popupPromoConfig.popupPromoEnabled && (
        <PromoPopup config={popupPromoConfig} />
      )}
    </Layout>
  )
}
