import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { MoveLeft } from "lucide-react"
import invariant from "tiny-invariant"
import ErrorBoundaryPage from "~/components/ErrorBoundaryPage"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { client } from "~/sanity/client"
import { Tag, getTag } from "~/sanity/queries"
import isLangSupportedLang from "~/sanity/queries/isLangSupportedLang"

type LoaderDataType = {
  tag: Tag
}

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.tag, "Expected tag param")
  isLangSupportedLang(params.lang)
  const tag = await getTag(client, params.tag!, params.lang!)

  if (!tag) {
    throw new Response("Not found", { status: 404 })
  }

  return json({
    tag,
  })
}

export default function TagByNameRoute() {
  const { tag } = useLoaderData() as LoaderDataType

  return (
    <Layout useMargins>
      <Link
        to={`/${tag.language}/tag`}
        className="text-red-600 hover:text-red-500"
      >
        <MoveLeft className="inline h-4 w-4" /> Back to All Tags
      </Link>
      <Typography.H1>{tag.title[tag.language]}</Typography.H1>
      <Typography.TextMuted>
        {tag.description[tag.language]}
      </Typography.TextMuted>
    </Layout>
  )
}

export function ErrorBoundary({ error }: { error: string }) {
  return <ErrorBoundaryPage error={error?.toString()} />
}
