import { Typography } from "~/components/Typography"
import { Author } from "~/sanity/queries"
import {
  AtSign,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MoveRight,
  Twitter,
  Youtube,
} from "lucide-react"
import { Image } from "~/components/Image"
import { Link } from "@remix-run/react"
import { useTranslate } from "~/lib/useTranslate"

enum AuthorLinksKeys {
  Website = "website",
  Instagram = "instagram",
  Threads = "threads",
  Twitter = "twitter",
  Facebook = "facebook",
  Youtube = "youtube",
  Email = "email",
}

export default function AuthorCard({
  author,
  showLinkToAuthorPage,
}: {
  author: Author
  showLinkToAuthorPage?: boolean
}) {
  const { translations } = useTranslate()

  const getUrl = (key: AuthorLinksKeys) => {
    switch (key) {
      case AuthorLinksKeys.Website:
        return author[key]
      case AuthorLinksKeys.Instagram:
        return `https://instagram.com/${author[key]}`
      case AuthorLinksKeys.Threads:
        return `https://threads.net/${author[key]}`
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
    <div className="space-y-8 text-center">
      <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border bg-slate-200 dark:bg-slate-800">
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

      <Typography.Paragraph className="m-auto max-w-4xl px-8 text-left">
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
      {showLinkToAuthorPage && (
        <div className="my-8">
          <Link
            to={`/${author.language}/authors/${author.slug}`}
            className="text-red-600 hover:text-red-500"
            prefetch="intent"
          >
            {translations.viewAll} posts by {author.name}{" "}
            <MoveRight className="inline h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
