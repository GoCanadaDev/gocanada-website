import { PostPreview } from "~/sanity/queries"
import Card from "./Card"

export const CardGrid = ({ posts }: { posts: PostPreview[] }) => {
  if (!posts || posts.length === 0) {
    return null
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
      {posts.length
        ? posts.map((post) => (
            <Card key={post.title[post.language]} post={post} />
          ))
        : null}
    </div>
  )
}
