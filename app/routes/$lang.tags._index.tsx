import { Link, MetaFunction, useLoaderData, useParams } from "@remix-run/react"
import { json, LoaderFunction } from "@remix-run/node"
import { client } from "~/sanity/client"
import { SupportedLanguages } from "~/i18n"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { Tag, getTags } from "~/sanity/queries"
import { MoveRight, Tag as TagIcon } from "lucide-react"
import { SITE_META } from "~/lib/utils"

export const meta: MetaFunction<typeof loader> = () => {
  const title = ["Tags", SITE_META.siteTitle].filter(Boolean).join(" | ")

  return [
    { title },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:title", content: title },
    { property: "og:title", content: title },
  ]
}

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
    <Layout translationUrl={lang === "en" ? "/fr/tags" : "/en/tags"} useMargins>
      <div className="grid auto-rows-min grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {tags?.map((tag) => {
          const linkTo = `/${lang}/tags/${tag.slug[lang]}`

          return (
            <div
              key={tag.title[lang]}
              className="mb-4 overflow-hidden rounded-md bg-zinc-50 p-4 dark:bg-zinc-800"
            >
              <div className="flex items-start">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border ">
                  <TagIcon className="h-6 w-6 flex-shrink-0" />
                </div>

                <div className="ml-4 space-y-4">
                  <Typography.H3>{tag.title[lang]}</Typography.H3>
                  <Typography.TextMuted>
                    {typeof tag.description[lang] === "string"
                      ? tag.description[lang]
                      : "No description"}
                  </Typography.TextMuted>
                  <Typography.TextSmall>
                    <Link
                      prefetch="intent"
                      to={linkTo}
                      className="before:absolute before:inset-0"
                    >
                      <span className="sr-only">View all</span>
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
