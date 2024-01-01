import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { MoveLeft } from "lucide-react"
import invariant from "tiny-invariant"
import ErrorBoundaryPage from "~/components/ErrorBoundaryPage"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { client } from "~/sanity/client"
import { Category, getCategory } from "~/sanity/queries"
import isLangSupportedLang from "~/sanity/queries/isLangSupportedLang"

type LoaderDataType = {
  category: Category
}

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.category, "Expected category param")
  isLangSupportedLang(params.lang)
  const category = await getCategory(client, params.category!, params.lang!)

  if (!category) {
    throw new Response("Not found", { status: 404 })
  }

  return json({
    category,
  })
}

export default function CategoryByNameRoute() {
  const { category } = useLoaderData() as LoaderDataType

  return (
    <Layout useMargins>
      <Link
        to={`/${category.language}/category`}
        className="text-red-600 hover:text-red-500"
      >
        <MoveLeft className="inline h-4 w-4" /> Back to All Categories
      </Link>
      <Typography.H1>{category.title[category.language]}</Typography.H1>
      <Typography.TextMuted>
        {category.description[category.language]}
      </Typography.TextMuted>
    </Layout>
  )
}

export function ErrorBoundary({ error }: { error: string }) {
  return <ErrorBoundaryPage error={error?.toString()} />
}
