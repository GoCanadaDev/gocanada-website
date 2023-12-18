import { Link } from "@remix-run/react"

import { urlForImage } from "~/lib/sanity.image"
import { type Post } from "~/sanity/queries"
import { formatDate } from "~/lib/formatDate"
import { SupportedLanguages } from "~/i18n"

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
    <div className="card">
      {postInLocale.mainImage ? (
        <img
          className="card__cover"
          src={urlForImage(postInLocale.mainImage)!
            .width(500)
            .height(300)
            .url()}
          height={300}
          width={500}
          alt=""
        />
      ) : (
        <div className="card__cover--none" />
      )}
      <div className="card__container">
        <h3 className="card__title text-2xl font-bold">
          <Link
            prefetch="intent"
            className="card__link"
            to={`${postInLocale.language}/${postInLocale.slug.current}`}
          >
            {postInLocale.title}
          </Link>
        </h3>
        <p className="card__excerpt">{postInLocale.excerpt}</p>
        <p className="card__date">
          {formatDate(postInLocale._createdAt, postInLocale.language)}
        </p>
      </div>
    </div>
  )
}
