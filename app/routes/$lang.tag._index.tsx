import { Link, useLoaderData, useParams } from "@remix-run/react"
import { json, LoaderFunction } from "@remix-run/node"
import { client } from "~/sanity/client"
import { SupportedLanguages } from "~/i18n"
import isLangSupportedLang from "~/sanity/queries/isLangSupportedLang"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import ErrorBoundaryPage from "~/components/ErrorBoundaryPage"
import { Tag, getTags } from "~/sanity/queries"

interface IndexLoaderData {
  tags: Tag[]
}

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)
  const tags = await getTags(client, params.lang!)

  return json<IndexLoaderData>({
    tags,
  })
}

export default function TagIndexRoute() {
  const { tags } = useLoaderData() as IndexLoaderData
  const params = useParams()
  const lang = params.lang as SupportedLanguages

  return (
    <Layout translationUrl={lang === "en" ? "/fr/tag" : "/en/tag"} useMargins>
      <div>
        {tags?.map((tag) => {
          const linkTo = `/${lang}/tag/${tag.slug[lang]}`

          return (
            <div key={tag.title[lang]}>
              <Link prefetch="intent" to={linkTo}>
                <Typography.H3>{tag.title[lang]}</Typography.H3>
                <Typography.TextMuted key={tag.description[lang]}>
                  {tag.description[lang]}
                </Typography.TextMuted>
              </Link>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}

export function ErrorBoundary({ error }: { error: string }) {
  return <ErrorBoundaryPage error={error?.toString()} />
}
