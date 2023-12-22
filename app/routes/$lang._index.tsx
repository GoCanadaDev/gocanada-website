import type { MetaFunction, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData, useParams } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import ErrorBoundaryPage from "~/components/ErrorBoundaryPage"
import type { RootLoaderData as RootLoader } from "~/root"
import { Post, getPosts } from "~/sanity/queries"
import { client } from "~/sanity/client"
import Card from "~/components/Card"
import { SupportedLanguages } from "~/i18n"
import { Layout } from "~/components/Layout"

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
  posts: any
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const posts = await getPosts(client, params.lang as SupportedLanguages)

  return json<IndexLoaderData>({
    posts,
  })
}

export default function Index() {
  const { lang } = useParams()
  let {
    i18n: { language },
  } = useTranslation()
  const { posts } = useLoaderData() as IndexLoaderData
  const currentLang = language as SupportedLanguages

  let { t, ready } = useTranslation()

  return (
    <Layout translationUrl={currentLang === "en" ? "/fr" : "/en"}>
      <div className="full-bleed container grid grid-cols-1 gap-6 lg:gap-12">
        {ready ? <h1>{t("greeting")}</h1> : null}
        {posts.length
          ? posts.map((post: Post) => (
              <Card key={post.title} post={post} currentLang={currentLang} />
            ))
          : null}
      </div>
    </Layout>
  )
}

export function ErrorBoundary({ error }: { error: string }) {
  return <ErrorBoundaryPage error={error?.toString()} />
}
