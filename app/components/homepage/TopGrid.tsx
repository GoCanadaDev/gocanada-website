import { PostPreview } from "~/sanity/queries"
import Card from "../Card"

export const TopGrid = ({ posts }: { posts: PostPreview[] }) => {
  return (
    <div className="mb-24 grid grid-cols-1 grid-rows-1 gap-8 pb-24 sm:grid-cols-2 md:grid-cols-[repeat(4,_1fr)] md:grid-rows-[repeat(2,_1fr)]">
      <div className="sm:col-span-2 md:col-span-2 md:col-start-2 md:row-span-2">
        <Card post={posts[0]} showExcerpt isLarge />
      </div>
      <div className="col-span-1 md:col-start-1 md:row-span-1 md:row-start-1">
        <Card post={posts[1]} showExcerpt />
      </div>
      <div className="col-span-1 md:col-start-1 md:row-span-1 md:row-start-2">
        <Card post={posts[2]} showExcerpt />
      </div>
      <div className="col-span-1 md:col-start-4 md:row-span-1 md:row-start-1">
        <Card post={posts[3]} showExcerpt />
      </div>
      <div className="col-span-1 md:col-start-4 md:row-span-1 md:row-start-2">
        <Card post={posts[4]} showExcerpt />
      </div>
    </div>
  )
}
