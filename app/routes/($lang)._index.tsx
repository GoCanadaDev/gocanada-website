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
import { SUPPORTED_LANGUAGES, SupportedLanguages } from "~/i18n"

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
  locale: SupportedLanguages
}

export const loader: LoaderFunction = async ({ request }) => {
  let locale = (await i18next.getLocale(request)) as SupportedLanguages

  const language = locale ?? SUPPORTED_LANGUAGES[0]
  const posts = await getPosts(client, language)

  return json<IndexLoaderData>({
    posts,
    locale,
  })
}

export default function Index() {
  const { posts, locale } = useLoaderData() as IndexLoaderData

  let { t } = useTranslation()

  return (
    <div className="full-bleed container grid grid-cols-1 gap-6 lg:gap-12">
      <h1>{t("greeting")}</h1>
      {posts.length
        ? posts.map((post: Post) => (
            <Card key={post.title} post={post} locale={locale} />
          ))
        : null}
    </div>
  )
}

export function ErrorBoundary({ error }: { error: string }) {
  return <ErrorBoundaryPage error={error?.toString()} />
}
