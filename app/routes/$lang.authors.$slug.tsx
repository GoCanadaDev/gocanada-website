import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, MetaFunction, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { CardGrid } from "~/components/CardGrid"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { Separator } from "~/components/ui/separator"
import { client } from "~/sanity/client"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { Author, getAuthor } from "~/sanity/queries"
import { useOtherLanguage } from "~/lib/useOtherLanguage"
import { useTranslate } from "~/lib/useTranslate"
import { MoveLeft } from "lucide-react"
import { Image } from "~/components/Image"
import { SITE_META } from "~/lib/utils"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: LoaderDataType
}) => {
  const title = [data?.author?.name, SITE_META.siteTitle]
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
  author: Author
}

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  isLangSupportedLang(params.lang)
  invariant(params.slug, "Expected slug param")

  const author = await getAuthor(client, params.lang!, params.slug!)

  if (!author) {
    throw new Response("Not found", { status: 404 })
  }

  return json({
    author,
  })
}

export default function AuthorBySlugRoute() {
  const { author } = useLoaderData() as LoaderDataType
  const { translate } = useTranslate()
  const otherLanguage = useOtherLanguage()
  const translationUrl = `/${otherLanguage}/${author.slug}`

  return (
    <Layout useMargins translationUrl={translationUrl}>
      <Link
        to={`/${author.language}/authors`}
        className="text-red-600 hover:text-red-500"
      >
        <MoveLeft className="inline h-4 w-4" /> {translate("viewAll")}
      </Link>
      <div className="holy-grail space-y-8 text-center">
        <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <Image
            mode="cover"
            id={author.image.id}
            alt=""
            width={96}
            preview={author.image.preview ?? ""}
            loading="eager"
            className="transition-transform hover:scale-[1.05]"
          />
        </div>
        <Typography.H1>{author.name}</Typography.H1>
        <Typography.TextMuted>
          {author.bio[author.language]}
        </Typography.TextMuted>
      </div>
      <Separator className="my-8" />
      <CardGrid posts={author.posts ?? []} />
    </Layout>
  )
}
