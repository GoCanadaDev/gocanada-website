import { Link } from "@remix-run/react"

import { type PostPreview } from "~/sanity/queries"
import { SupportedLanguages } from "~/i18n"
import { Typography } from "./Typography"
import { AspectRatio } from "./ui/aspect-ratio"
import { Image } from "./Image"

export default function Card({
  post,
  currentLang,
}: {
  post: PostPreview
  currentLang: SupportedLanguages | undefined
}) {
  const postInLocale = post._translations!.find(
    (l) => l.language === currentLang
  )!

  return (
    <div className="card max-w-screen-sm">
      {postInLocale.mainImage ? (
        <AspectRatio
          ratio={16 / 9}
          className="mb-4 overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800"
        >
          <Link
            prefetch="intent"
            to={`/${postInLocale.language}/${postInLocale.slug.current}`}
          >
            <Image
              id={postInLocale.mainImage.id}
              alt=""
              width={640}
              preview={postInLocale.mainImage.preview}
              loading="eager"
              className="transition-transform hover:scale-[1.05]"
            />
          </Link>
        </AspectRatio>
      ) : null}
      <div className="card__container">
        <Typography.H4>{postInLocale.category}</Typography.H4>
        <Typography.H3>
          <Link
            prefetch="intent"
            to={`/${postInLocale.language}/${postInLocale.slug.current}`}
          >
            {postInLocale.title}
          </Link>
        </Typography.H3>
      </div>
    </div>
  )
}
