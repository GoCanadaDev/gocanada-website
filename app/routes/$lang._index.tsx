import type { MetaFunction, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import ErrorBoundaryPage from "~/components/ErrorBoundaryPage"
import type { RootLoaderData as RootLoader } from "~/root"
import { PostPreview, getPosts } from "~/sanity/queries"
import { client } from "~/sanity/client"
import Card from "~/components/Card"
import { SupportedLanguages } from "~/i18n"
import { Layout } from "~/components/Layout"
import { useTranslate } from "~/lib/useTranslate"

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
  const posts = await getPosts(client, params.lang as SupportedLanguages)

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
      <div className="full-bleed container grid grid-cols-2 gap-6 lg:gap-12">
        {posts.length
          ? posts.map((post) => <Card key={post.title} post={post} />)
          : null}
      </div>
    </Layout>
  )
}

export function ErrorBoundary({ error }: { error: string }) {
  return <ErrorBoundaryPage error={error?.toString()} />
}
