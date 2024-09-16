import { Link, MetaFunction, useLoaderData, useParams } from "@remix-run/react"
import { json, LoaderFunction } from "@remix-run/node"
import { client } from "~/sanity/client"
import { SupportedLanguages } from "~/i18n"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { Author, getAuthors } from "~/sanity/queries"
import UserMediaObject from "~/components/UserMediaObject"
import { getSiteConfig, SiteConfigType } from "~/sanity/queries/siteConfig"
import { genericMetaTags } from "~/lib/utils"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: LoaderDataType
}) => {
  const title = `Authors | ${data.siteConfig.siteTitle}`
  const description = data.siteConfig.siteDescription
  return genericMetaTags({ title, description })
}

type LoaderDataType = {
  authors: Author[]
  siteConfig: SiteConfigType
}

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)
  const authors = await getAuthors(client, params.lang!)
  const siteConfig = await getSiteConfig(client)

  return json(
    {
      authors,
      siteConfig,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Netlify-CDN-Cache-Control": "public, s-maxage=31536000",
        "Cache-Tag": `authors`,
      },
    }
  )
}

export default function AuthorsIndexRoute() {
  const { authors } = useLoaderData<LoaderDataType>()
  const params = useParams()
  const lang = params.lang as SupportedLanguages

  return (
    <Layout
      translationUrl={lang === "en" ? "/fr/authors" : "/en/authors"}
      useMargins
    >
      <div className="grid auto-rows-min grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {authors?.map((author) => {
          if (author.postsCount === 0) {
            return null
          }
          const linkTo = `/${lang}/authors/${author.slug}`

          return (
            <div
              key={author.name}
              className="relative mb-4 overflow-hidden rounded-md bg-zinc-50 p-4 dark:bg-zinc-800"
            >
              <UserMediaObject
                name={author.name}
                image={author.image}
                content={
                  <div className="space-y-4">
                    <Typography.H3>{author.name}</Typography.H3>
                    {typeof author.title === "string" && (
                      <Typography.H4>{author.title}</Typography.H4>
                    )}
                    <Typography.TextMuted className="line-clamp-3">
                      {author.bio[lang]}
                    </Typography.TextMuted>

                    <Link
                      prefetch="intent"
                      to={linkTo}
                      className="text-brand before:absolute before:inset-0 hover:text-brandHover"
                    >
                      <span className="sr-only">
                        Read more about {author.name}
                      </span>
                    </Link>
                  </div>
                }
              />
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
