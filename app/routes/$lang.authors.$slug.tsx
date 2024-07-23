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
import { MoveLeft, Search } from "lucide-react"
import { SITE_META } from "~/lib/utils"
import AuthorCard from "~/components/AuthorCard"

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
  const otherLanguage = useOtherLanguage()
  const translationUrl = `/${otherLanguage}/${author.slug}`

  return (
    <Layout useMargins translationUrl={translationUrl}>
      <Link
        to={`/${author.language}/authors`}
        className="text-red-600 hover:text-red-500"
      >
        <MoveLeft className="inline h-4 w-4" /> View all
      </Link>
      <AuthorCard author={author} />
      <Separator className="my-8" />
      {author.posts && author.posts.length > 0 ? (
        <CardGrid posts={author.posts} />
      ) : (
        <div className="text-center">
          <Search className="mb-4 inline h-12 w-12" />
          <Typography.H3>No Posts Found</Typography.H3>
          <Typography.Paragraph>
            {author.name} has not written any posts yet.
          </Typography.Paragraph>
        </div>
      )}
    </Layout>
  )
}
