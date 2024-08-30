import type { MetaFunction, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Params, useLoaderData } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import {
  Post,
  PostPreview,
  featuredPostsQuery,
  getFeaturedPosts,
  getPosts,
  getTrendingPosts,
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

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: IndexLoaderData
}) => {
  return [
    { title: data.siteConfig.siteTitle },
    {
      name: "description",
      content: data.siteConfig.siteDescription,
    },
  ]
}

type IndexLoaderData = {
  featuredPosts: PostPreview[]
  siteConfig: SiteConfigType
  trendingPosts: PostPreview[]
  params: Params
  posts: QueryResponseInitial<Post[]>
}

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.lang) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    })
  }

  isLangSupportedLang(params.lang)
  // const posts = await getPosts(client, params.lang!)
  // const featuredPosts = await getFeaturedPosts(client, params.lang!)
  // const trendingPosts = await getTrendingPosts(client, params.lang!)
  const siteConfig = await getSiteConfig(client)

  const posts = await loadQuery<Post[]>(postsQuery, {
    language: params.lang,
  }).then((res) => ({
    ...res,
    data: res.data ? res.data : null,
  }))

  if (!posts.data) {
    throw new Response("Posts Not found", { status: 404 })
  }

  const featuredPosts = await loadQuery<Post[]>(featuredPostsQuery, {
    language: params.lang,
  }).then((res) => ({
    ...res,
    data: res.data ? res.data : null,
  }))

  if (!featuredPosts.data) {
    throw new Response("Featured Posts Not found", { status: 404 })
  }

  const trendingPosts = await loadQuery<Post[]>(trendingPostsQuery, {
    language: params.lang,
  }).then((res) => ({
    ...res,
    data: res.data ? res.data : null,
  }))

  if (!trendingPosts.data) {
    throw new Response("Featured Posts Not found", { status: 404 })
  }

  return json<IndexLoaderData>({
    featuredPosts,
    siteConfig,
    trendingPosts,
    params,
    posts,
  })
}

export default function Index() {
  const { posts, featuredPosts, trendingPosts, params } =
    useLoaderData() as IndexLoaderData
  const {
    i18n: { language },
  } = useTranslation()
  const currentLang = language as SupportedLanguages
  const { data: postsData, loading } = useQuery<any>(
    postsQuery,
    { language: params.lang },
    {
      initial: posts,
    }
  )

  const { data: featuredPostsData, loading: featuredPostsLoading } =
    useQuery<any>(
      featuredPostsQuery,
      { language: params.lang },
      {
        initial: featuredPosts,
      }
    )

  const { data: trendingPostsData, loading: trendingPostsLoading } =
    useQuery<any>(
      trendingPostsQuery,
      { language: params.lang },
      {
        initial: trendingPosts,
      }
    )

  const remainingPosts =
    !loading &&
    !featuredPostsLoading &&
    !trendingPostsLoading &&
    postsData?.filter(
      (post) =>
        !featuredPostsData.featuredPosts.some(
          (featured) => featured._id === post._id
        ) &&
        !trendingPostsData.trendingPosts.some(
          (trending) => trending._id === post._id
        )
    )

  return (
    <Layout translationUrl={currentLang === "en" ? "/fr" : "/en"} useMargins>
      <TopGrid posts={featuredPostsData.featuredPosts} />
      <MidRollBannerAd />
      <Trending posts={trendingPostsData.trendingPosts} />
      <CardGrid posts={remainingPosts} />
    </Layout>
  )
}
