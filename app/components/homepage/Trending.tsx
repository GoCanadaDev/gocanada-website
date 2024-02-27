import { Link } from "@remix-run/react"
import { type PostPreview } from "~/sanity/queries"
import { Typography } from "../Typography"
import { Image } from "../Image"
import { useTranslate } from "~/lib/useTranslate"
import { MoveRight } from "lucide-react"
import { AspectRatio } from "../ui/aspect-ratio"

export const Trending = ({ posts }: { posts: PostPreview[] }) => {
  const { translate } = useTranslate()

  console.log({ posts })

  if (!posts) {
    return null
  }
  return (
    <div className="mb-24">
      <div className="text-center">
        <Typography.H2>Trending Stories</Typography.H2>
      </div>
      <div className="mt-12 grid grid-cols-3 gap-8">
        {posts.map((post) => (
          <article className="relative flex gap-8" key={post._id}>
            <div className="h-24 w-24 flex-shrink-0">
              {post.mainImage && post.mainImage?.id ? (
                <AspectRatio
                  ratio={1}
                  className="overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800"
                >
                  <Image
                    mode="cover"
                    id={post.mainImage.id}
                    alt=""
                    width={300}
                    height={300}
                    preview={post.mainImage.preview ?? ""}
                    loading="lazy"
                    aria-label={`${translate("readMore")}: ${
                      post.title[post.language]
                    }`}
                  />
                </AspectRatio>
              ) : null}
            </div>
            <div className="">
              <Typography.H4>
                {post.category.title[post.language]}
              </Typography.H4>
              <Typography.H3 className="my-4 text-xl">
                {post.title[post.language]}
              </Typography.H3>

              <p>
                <Link
                  className="text-sm before:absolute before:inset-0"
                  prefetch="intent"
                  to={`/${post.language}/${post.slug[post.language]}`}
                  aria-label={`${translate("readMore")}: ${
                    post.title[post.language]
                  }`}
                >
                  {translate("readMore")}{" "}
                  <MoveRight className="inline h-4 w-4" />
                </Link>
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
