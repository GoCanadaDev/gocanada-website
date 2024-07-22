import type { MetaFunction, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import type { RootLoaderData } from "~/root"
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
import { SITE_META } from "~/lib/utils"

export const meta: MetaFunction<typeof loader> = () => {
  const title = [SITE_META.title, SITE_META.siteTitle]
    .filter(Boolean)
    .join(" | ")

  return [{ title }]
}

type IndexLoaderData = {
  posts: PostPreview[]
  latestPosts: PostPreview[]
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
    trendingPosts,
  })
}

export let handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "common",
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
