import { Link } from "@remix-run/react"

import { urlForImage } from "~/lib/sanity.image"
import { type Post } from "~/sanity/queries"
import { formatDate } from "~/lib/formatDate"
import { SupportedLanguages } from "~/i18n"
import { Typography } from "./Typography"
import { AspectRatio } from "./ui/aspect-ratio"
import { Image } from "./Image"

export default function Card({
  post,
  currentLang,
}: {
  post: Post
  currentLang: SupportedLanguages
}) {
  const postInLocale = post._translations!.find(
    (l) => l.language === currentLang
  )!

  return (
    <div className="card max-w-screen-sm">
      {postInLocale.mainImage ? (
        <AspectRatio
          ratio={16 / 9}
          className="overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800"
        >
          <Image
            id={postInLocale.mainImage.id}
            alt=""
            width={640}
            preview={postInLocale.mainImage.preview}
            loading="eager"
          />
        </AspectRatio>
      ) : null}
      <div className="card__container">
        <Typography.H3>
          <Link
            prefetch="intent"
            className="card__link"
            to={`/${postInLocale.language}/${postInLocale.slug.current}`}
          >
            {postInLocale.title}
          </Link>
        </Typography.H3>
        <Typography.TextSmall>
          {formatDate(postInLocale._createdAt, postInLocale.language)}
        </Typography.TextSmall>
        <Typography.Paragraph>{postInLocale.excerpt}</Typography.Paragraph>
      </div>
    </div>
  )
}
