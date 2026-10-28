import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import type { MetaFunction } from "@remix-run/react"
import { Link, useLoaderData } from "@remix-run/react"
import { Search } from "lucide-react"
import invariant from "tiny-invariant"

import { AuthorCard } from "~/components/AuthorCard"
import { CardGrid } from "~/components/CardGrid"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { Separator } from "~/components/ui/separator"
import { isLangSupportedLang } from "~/lib/isLangSupportedLang"
import {
  generateBlogSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateProfilePageSchema,
  generateWebsiteSchema,
} from "~/lib/structuredData"
import { useOtherLanguage } from "~/lib/useOtherLanguage"
import { genericMetaTags } from "~/lib/utils"
import { client } from "~/sanity/client"
import type { Author } from "~/sanity/queries"
import { getAuthor } from "~/sanity/queries"
import type { SiteConfigType } from "~/sanity/queries/siteConfig"
import { getSiteConfig } from "~/sanity/queries/siteConfig"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: LoaderDataType
}) => {
  const title = `${data.author.name} | ${data.siteConfig.siteTitle}`
  const authorBio = data.author.bio.en?.trim()
  const fallbackDescription = `Read articles by ${data.author.name} on ${data.siteConfig.siteTitle}.`
  const description =
    (authorBio ? authorBio.substring(0, 160) : "") || fallbackDescription
  const canonical = `https://gocanada.com/en/authors/${data.author.slug}`
  return genericMetaTags({
    title,
    description,
    canonical,
    schemas: [
      generateOrganizationSchema(),
      generateWebsiteSchema(),
      generateProfilePageSchema(data.author),
      generateBlogSchema({
        description,
        url: canonical,
        posts: data.author.posts,
      }),
      generateBreadcrumbSchema([
        {
          name: "Home",
          url: "https://gocanada.com/en",
        },
        {
          name: "Authors",
          url: "https://gocanada.com/en/authors",
        },
        {
          name: data.author.name,
          url: canonical,
        },
      ]),
    ],
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
              <Link to="/en" prefetch="intent">
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
