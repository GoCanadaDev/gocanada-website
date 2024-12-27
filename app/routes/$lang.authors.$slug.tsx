import type { LoaderFunction, LoaderFunctionArgs } from "react-router"
import { json } from "react-router"
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
import { Search } from "lucide-react"
import AuthorCard from "~/components/AuthorCard"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { getSiteConfig, SiteConfigType } from "~/sanity/queries/siteConfig"
import { genericMetaTags } from "~/lib/utils"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: LoaderDataType
}) => {
  const title = `${data.author.name} | ${data.siteConfig.siteTitle}`
  const description =
    data.author.bio.en.substring(0, 160) || data.siteConfig.siteDescription
  return genericMetaTags({
    title,
    description,
    canonical: `/en/authors/${data.author.slug}`,
  })
}

type LoaderDataType = {
  author: Author
  siteConfig: SiteConfigType
}

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  isLangSupportedLang(params.lang)
  invariant(params.slug, "Expected slug param")

  const author = await getAuthor(client, params.lang!, params.slug!)
  const siteConfig = await getSiteConfig(client)

  if (!author) {
    throw new Response("Not found", { status: 404 })
  }

  return json(
    {
      author,
      siteConfig,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Netlify-CDN-Cache-Control": "public, s-maxage=31536000",
        "Cache-Tag": `authors:${author._id}`,
      },
    }
  )
}

export default function AuthorBySlugRoute() {
  const { author } = useLoaderData<LoaderDataType>()
  const otherLanguage = useOtherLanguage()
  const translationUrl = `/${otherLanguage}/${author.slug}`

  return (
    <Layout useMargins translationUrl={translationUrl}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" prefetch="intent">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link prefetch="intent" to={`/${author.language}/authors`}>
                Authors
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{author.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
