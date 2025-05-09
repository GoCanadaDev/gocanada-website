import { PostPreview } from "~/sanity/queries"
import Card from "./Card"
import { sanitizeStrings } from "~/lib/sanitizeStrings"

export const CardGrid = ({
  posts,
  categoryToUse,
}: {
  posts: PostPreview[]
  categoryToUse?: PostPreview["categories"][0]
}) => {
  if (!posts || posts.length === 0) {
    return null
  }

  const sanitizedPosts = Object.values(sanitizeStrings<PostPreview[]>(posts))

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
      {posts.length
        ? sanitizedPosts.map((post) => (
            <Card
              key={post.title[post.language]}
              post={post}
              categoryToUse={categoryToUse}
              loadingMode="lazy"
            />
          ))
        : null}
    </div>
  )
}
