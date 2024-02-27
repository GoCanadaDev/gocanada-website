import { PostPreview } from "~/sanity/queries"
import Card from "../Card"

export const TopGrid = ({ posts }: { posts: PostPreview[] }) => {
  return (
    <div className="mb-24 grid grid-cols-[repeat(4,_1fr)] grid-rows-[repeat(2,_1fr)] gap-8 pb-24">
      <div className="row-span2 col-span-2 col-start-2 row-span-2">
        <Card post={posts[0]} showExcerpt />
      </div>
      <div className="col-span-1 col-start-1 row-span-1 row-start-1">
        <Card post={posts[1]} />
      </div>
      <div className="col-span-1 col-start-1 row-span-1 row-start-2">
        <Card post={posts[2]} />
      </div>
      <div className="col-span-1 col-start-4 row-span-1 row-start-1">
        <Card post={posts[3]} />
      </div>
      <div className="col-span-1 col-start-4 row-span-1 row-start-2">
        <Card post={posts[4]} />
      </div>
    </div>
  )
}
