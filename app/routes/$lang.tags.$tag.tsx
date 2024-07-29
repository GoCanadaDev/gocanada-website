import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, MetaFunction, useLoaderData } from "@remix-run/react"
import { MoveLeft, Tag as TagIcon } from "lucide-react"
import invariant from "tiny-invariant"
import { CardGrid } from "~/components/CardGrid"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { Separator } from "~/components/ui/separator"
import { client } from "~/sanity/client"
import { Tag, getTag } from "~/sanity/queries"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { useOtherLanguage } from "~/lib/useOtherLanguage"
import { SITE_META } from "~/lib/utils"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: LoaderDataType
}) => {
  const title = [data?.tag?.title[data.tag.language], SITE_META.siteTitle]
    .filter(Boolean)
    .join(" | ")

  return [
    { title },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:title", content: title },
    { property: "og:title", content: title },
  ]
}

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
  const otherLanguage = useOtherLanguage()
  const translationUrl = `/${otherLanguage}/tags/${tag.slug[otherLanguage]}`

  return (
    <Layout useMargins translationUrl={translationUrl}>
      <Link
        to={`/${tag.language}/tags`}
        className="hover:text-brandHover text-brand"
      >
        <MoveLeft className="inline h-4 w-4" /> View all
      </Link>
      <div className="holy-grail space-y-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center rounded-full border-4 border-slate-100 transition-colors duration-1000 ease-in-out dark:border-slate-800">
          <TagIcon className="mx-auto h-8 w-8" />
        </div>
        <Typography.H4>Posts Tagged</Typography.H4>
        <Typography.H1>{tag.title[tag.language]}</Typography.H1>
        <Typography.TextMuted>
          {tag.description[tag.language]}
        </Typography.TextMuted>
      </div>
      <Separator className="my-8" />

      <CardGrid posts={tag.posts ?? []} />
    </Layout>
  )
}
