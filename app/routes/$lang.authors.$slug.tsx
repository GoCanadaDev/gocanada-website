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
import {
  AtSign,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MoveLeft,
  Search,
  Twitter,
  Youtube,
} from "lucide-react"
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

enum AuthorLinksKeys {
  Website = "website",
  Instagram = "instagram",
  Threads = "threads",
  Twitter = "twitter",
  Facebook = "facebook",
  Youtube = "youtube",
  Email = "email",
}

export default function AuthorBySlugRoute() {
  const { author } = useLoaderData() as LoaderDataType
  const { translations } = useTranslate()
  const otherLanguage = useOtherLanguage()
  const translationUrl = `/${otherLanguage}/${author.slug}`

  const getUrl = (key: AuthorLinksKeys) => {
    switch (key) {
      case AuthorLinksKeys.Website:
        return author[key]
      case AuthorLinksKeys.Instagram:
        return `https://instagram.com/${author[key]}`
      case AuthorLinksKeys.Threads:
        return `https://threads.com/${author[key]}`
      case AuthorLinksKeys.Twitter:
        return `https://twitter.com/${author[key]}`
      case AuthorLinksKeys.Youtube:
        return `https://youtube.com/${author[key]}`
      case AuthorLinksKeys.Facebook:
        return `https://facebook.com/${author[key]}`
      case AuthorLinksKeys.Email:
        return `mailto:${author[key]}`
    }
  }

  const getIcon = (key: AuthorLinksKeys) => {
    switch (key) {
      case "website":
        return <Globe />
      case "instagram":
        return <Instagram />
      case "threads":
        return <AtSign />
      case "twitter":
        return <Twitter />
      case "youtube":
        return <Youtube />
      case "facebook":
        return <Facebook />
      case "email":
        return <Mail />
    }
  }

  const links = (
    [
      "website",
      "instagram",
      "threads",
      "twitter",
      "youtube",
      "facebook",
      "email",
    ] as AuthorLinksKeys[]
  ).map((key) => {
    if (key in author && typeof author[key] === "string") {
      return {
        key,
        label: key.toLocaleUpperCase(),
        url: getUrl(key),
        icon: getIcon(key),
      }
    } else {
      return null
    }
  })

  return (
    <Layout useMargins translationUrl={translationUrl}>
      <Link
        to={`/${author.language}/authors`}
        className="text-red-600 hover:text-red-500"
      >
        <MoveLeft className="inline h-4 w-4" /> {translations.viewAll}
      </Link>
      <div className="space-y-8 text-center">
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
        {typeof author.title === "string" && (
          <Typography.H4>{author.title}</Typography.H4>
        )}

        <Typography.Paragraph className="m-auto max-w-4xl text-left">
          {author.bio[author.language]}
        </Typography.Paragraph>
        {links && links.length > 0 && (
          <div className="m-auto flex max-w-4xl justify-center gap-8">
            {links.map((link) => {
              if (!link || !link.url) return null
              return (
                <a
                  href={link.url}
                  key={link.key}
                  className="flex gap-2 rounded-md p-2 transition-colors duration-200  hover:text-red-500 focus:bg-slate-100 focus:text-red-500 focus:outline-none dark:focus:bg-slate-800"
                >
                  {link.icon} {link.label}
                </a>
              )
            })}
          </div>
        )}
      </div>
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
