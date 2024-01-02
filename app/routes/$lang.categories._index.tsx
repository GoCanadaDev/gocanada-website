import { Link, MetaFunction, useLoaderData, useParams } from "@remix-run/react"
import { json, LoaderFunction } from "@remix-run/node"
import { Category, getCategories } from "~/sanity/queries"
import { client } from "~/sanity/client"
import { SupportedLanguages } from "~/i18n"
import isLangSupportedLang from "~/sanity/queries/isLangSupportedLang"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { RootLoaderData } from "~/root"
import { useTranslate } from "~/lib/useTranslate"
import { MoveRight, Tag as TagIcon } from "lucide-react"

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
  const { translate } = useTranslate()
  const lang = params.lang as SupportedLanguages

  return (
    <Layout
      translationUrl={lang === "en" ? "/fr/categories" : "/en/categories"}
      useMargins
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {categories?.map((category) => {
          const linkTo = `/${lang}/categories/${
            category.slug[category.language]
          }`

          return (
            <div
              key={category.title[lang]}
              className="mb-4 overflow-hidden rounded-md bg-slate-50 p-4 dark:bg-slate-800"
            >
              <div className="flex items-start">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border ">
                  <TagIcon className="h-6 w-6 flex-shrink-0" />
                </div>

                <div className="ml-4 space-y-4">
                  <Typography.H3>
                    {category.title[category.language]}
                  </Typography.H3>
                  <Typography.TextMuted>
                    {category.description[category.language]}
                  </Typography.TextMuted>
                  <Typography.TextSmall>
                    <Link
                      prefetch="intent"
                      to={linkTo}
                      className="text-red-600 hover:text-red-500"
                    >
                      {translate("viewAll")}{" "}
                      <MoveRight className="inline h-4 w-4" />
                    </Link>
                  </Typography.TextSmall>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
