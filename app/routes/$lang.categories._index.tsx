import { useLoaderData, useParams } from "@remix-run/react"
import { json, LoaderFunction } from "@remix-run/node"
import { Category, getCategories } from "~/sanity/queries"
import { client } from "~/sanity/client"
import { SupportedLanguages } from "~/i18n"
import isLangSupportedLang from "~/sanity/queries/isLangSupportedLang"

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
    <div>
      <div>
        {categories?.map((category) => (
          <div>
            <h3 key={category.name[lang]}>{category.name[lang]}</h3>
            <div className="italic" key={category.description[lang]}>
              {category.description[lang]}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
