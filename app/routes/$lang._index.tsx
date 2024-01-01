import type { MetaFunction, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import ErrorBoundaryPage from "~/components/ErrorBoundaryPage"
import type { RootLoaderData as RootLoader } from "~/root"
import { PostPreview, getPosts } from "~/sanity/queries"
import { client } from "~/sanity/client"
import { SupportedLanguages } from "~/i18n"
import { Layout } from "~/components/Layout"
import isLangSupportedLang from "~/sanity/queries/isLangSupportedLang"
import { CardGrid } from "~/components/CardGrid"

export const meta: MetaFunction<
  typeof loader,
  {
    root: RootLoader
  }
> = ({ matches }) => {
  const rootData = matches.find((match) => match.id === `root`)
    ?.data as RootLoader
  const home = rootData ? rootData.initial.data : null
  const title = [home?.title, home?.siteTitle].filter(Boolean).join(" | ")

  return [{ title }]
}

type IndexLoaderData = {
  posts: PostPreview[]
}

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)
  const posts = await getPosts(client, params.lang!)

  return json<IndexLoaderData>({
    posts,
  })
}

export default function Index() {
  const { posts } = useLoaderData() as IndexLoaderData
  const {
    i18n: { language },
  } = useTranslation()
  const currentLang = language as SupportedLanguages

  return (
    <Layout translationUrl={currentLang === "en" ? "/fr" : "/en"} useMargins>
      <CardGrid posts={posts} />
    </Layout>
  )
}

export function ErrorBoundary({ error }: { error: string }) {
  return <ErrorBoundaryPage error={error?.toString()} />
}
