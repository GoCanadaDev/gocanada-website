import { useLoaderData, useParams } from "@remix-run/react"
import { json, LoaderFunction } from "@remix-run/node"
import { Category, getCategories } from "~/sanity/queries"
import { client } from "~/sanity/client"
import { SupportedLanguages } from "~/i18n"
import isLangSupportedLang from "~/sanity/queries/isLangSupportedLang"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"

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

export default function CategoriesRoute() {
  const { categories } = useLoaderData() as IndexLoaderData
  const params = useParams()
  const lang = params.lang as SupportedLanguages

  return (
    <Layout
      translationUrl={lang === "en" ? "/fr/categories" : "/en/categories"}
      useMargins
    >
      <div>
        {categories?.map((category) => (
          <div key={category.name[lang]}>
            <Typography.H3>{category.name[lang]}</Typography.H3>
            <Typography.TextMuted key={category.description[lang]}>
              {category.description[lang]}
            </Typography.TextMuted>
          </div>
        ))}
      </div>
    </Layout>
  )
}
