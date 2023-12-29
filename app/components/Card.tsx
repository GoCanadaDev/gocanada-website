import { Link } from "@remix-run/react"

import { type PostPreview } from "~/sanity/queries"
import { Typography } from "./Typography"
import { AspectRatio } from "./ui/aspect-ratio"
import { Image } from "./Image"

export default function Card({ post }: { post: PostPreview }) {
  if (!post) {
    return null
  }

  return (
    <div className="card max-w-screen-sm">
      {post.mainImage && post.mainImage?.id ? (
        <AspectRatio
          ratio={16 / 9}
          className="mb-4 overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800"
        >
          <Link prefetch="intent" to={`/${post.language}/${post.slug.current}`}>
            <Image
              id={post.mainImage.id}
              alt=""
              width={640}
              preview={post.mainImage.preview ?? ""}
              loading="eager"
              className="transition-transform hover:scale-[1.05]"
            />
          </Link>
        </AspectRatio>
      ) : null}
      <div className="card__container">
        <Typography.H4>{post.category}</Typography.H4>
        <Typography.H3>
          <Link prefetch="intent" to={`/${post.language}/${post.slug.current}`}>
            {post.title}
          </Link>
        </Typography.H3>
        <p>
          <Link
            className="text-sm"
            prefetch="intent"
            to={`/${post.language}/${post.slug.current}`}
          >
            Read More →
          </Link>
        </p>
      </div>
    </div>
  )
}
