import type { MetaFunction, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import ErrorBoundaryPage from "~/components/ErrorBoundaryPage"
import type { LoaderData as RootLoader } from "~/root"
import { Post, getPosts } from "~/sanity/queries"
import i18next from "~/i18next.server"
import { client } from "~/sanity/client"
import Card from "~/components/Card"
import { SupportedLanguages } from "~/i18n"
import { Layout } from "~/components/Layout"
import { langPreferenceCookie } from "~/cookies"
import { z } from "zod"

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
  currentLang: SupportedLanguages
}

export const loader: LoaderFunction = async ({ request }) => {
  let locale = (await i18next.getLocale(request)) as SupportedLanguages

  const cookieHeader = request.headers.get("Cookie")
  const langCookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = z
    .union([z.literal("en"), z.literal("fr")])
    .optional()
    .parse(langCookie.langPreference)

  const currentLang = langPreference ?? locale
  const posts = await getPosts(client, currentLang)

  return json<IndexLoaderData>({
    posts,
    currentLang,
  })
}

export default function Index() {
  const { posts, currentLang } = useLoaderData() as IndexLoaderData

  let { t, ready } = useTranslation()

  return (
    <Layout>
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
