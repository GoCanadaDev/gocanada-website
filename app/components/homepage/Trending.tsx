import { type PostPreview } from "~/sanity/queries"
import { Typography } from "../Typography"
import { MiniCard } from "../MiniCard"

export const Trending = ({ posts }: { posts: PostPreview[] }) => {
  if (!posts) {
    return null
  }
  return (
    <div className="mb-24">
      <div className="text-center">
        <Typography.H2>Trending Stories</Typography.H2>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {posts.map((post) => (
          <MiniCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}
