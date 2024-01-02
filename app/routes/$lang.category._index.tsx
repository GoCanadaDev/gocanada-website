import { Link, MetaFunction, useLoaderData, useParams } from "@remix-run/react"
import { json, LoaderFunction } from "@remix-run/node"
import { Category, getCategories } from "~/sanity/queries"
import { client } from "~/sanity/client"
import { SupportedLanguages } from "~/i18n"
import isLangSupportedLang from "~/sanity/queries/isLangSupportedLang"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import ErrorBoundaryPage from "~/components/ErrorBoundaryPage"
import { RootLoaderData } from "~/root"

export const meta: MetaFunction<
  typeof loader,
  {
    root: RootLoaderData
  }
> = ({ matches }) => {
  const rootData = matches.find((match) => match.id === `root`)
    ?.data as RootLoaderData

  const home = rootData ? rootData.initial.data : null
  const title = ["Categories", home?.siteTitle].filter(Boolean).join(" | ")

  return [
    { title },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:title", content: title },
    { property: "og:title", content: title },
  ]
}

interface IndexLoaderData {
  categories: Category[]
}

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)
  const categories = await getCategories(client, params.lang!)

  return json<IndexLoaderData>({
    categories,
  })
}

export default function CategoryIndexRoute() {
  const { categories } = useLoaderData() as IndexLoaderData
  const params = useParams()
  const lang = params.lang as SupportedLanguages

  return (
    <Layout
      translationUrl={lang === "en" ? "/fr/category" : "/en/category"}
      useMargins
    >
      <div>
        {categories?.map((category) => {
          const linkTo = `/${lang}/category/${category.slug[lang]}`

          return (
            <div key={category.title[lang]}>
              <Link prefetch="intent" to={linkTo}>
                <Typography.H3>{category.title[lang]}</Typography.H3>
                <Typography.TextMuted key={category.description[lang]}>
                  {category.description[lang]}
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
