import type { MetaFunction, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import {
  PostPreview,
  getLatestPosts,
  getPosts,
  getTrendingPosts,
} from "~/sanity/queries"
import { client } from "~/sanity/client"
import { SupportedLanguages } from "~/i18n"
import { Layout } from "~/components/Layout"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { CardGrid } from "~/components/CardGrid"
import { TopGrid } from "~/components/homepage/TopGrid"
import { Trending } from "~/components/homepage/Trending"
import { getSiteConfig, SiteConfigType } from "~/sanity/queries/siteConfig"

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
  posts: PostPreview[]
  latestPosts: PostPreview[]
  siteConfig: SiteConfigType
  trendingPosts: PostPreview[]
}

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.lang) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    })
  }

  isLangSupportedLang(params.lang)
  const posts = await getPosts(client, params.lang!)
  const latestPosts = await getLatestPosts(client, params.lang!)
  const trendingPosts = await getTrendingPosts(client, params.lang!)
  const siteConfig = await getSiteConfig(client)

  if (posts.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: "Posts Not Found",
    })
  }

  if (latestPosts.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: "Latest Posts Not Found",
    })
  }

  return json<IndexLoaderData>({
    posts,
    latestPosts,
    siteConfig,
    trendingPosts,
  })
}

export default function Index() {
  const { posts, latestPosts, trendingPosts } =
    useLoaderData() as IndexLoaderData
  const {
    i18n: { language },
  } = useTranslation()
  const currentLang = language as SupportedLanguages

  return (
    <Layout translationUrl={currentLang === "en" ? "/fr" : "/en"} useMargins>
      <TopGrid posts={latestPosts} />
      <Trending posts={trendingPosts} />
      <CardGrid posts={posts} />
    </Layout>
  )
}
