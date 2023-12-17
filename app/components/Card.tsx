import { Link } from "@remix-run/react"

import { urlForImage } from "~/lib/sanity.image"
import { type Post } from "~/sanity/queries"
import { formatDate } from "~/lib/formatDate"
import { SupportedLanguages } from "~/i18n"

export default function Card({
  post,
  locale,
}: {
  post: Post
  locale: SupportedLanguages
}) {
  return (
    <div className="card">
      {post.mainImage ? (
        <img
          className="card__cover"
          src={urlForImage(post.mainImage)!.width(500).height(300).url()}
          height={300}
          width={500}
          alt=""
        />
      ) : (
        <div className="card__cover--none" />
      )}
      <div className="card__container">
        <h3 className="card__title text-2xl font-bold">
          <Link className="card__link" to={`${locale}/${post.slug.current}`}>
            {post.title}
          </Link>
        </h3>
        <p className="card__excerpt">{post.excerpt}</p>
        <p className="card__date">{formatDate(post._createdAt)}</p>
      </div>
    </div>
  )
}
