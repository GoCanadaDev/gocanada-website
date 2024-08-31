import { PostPreview } from "~/sanity/queries"
import Card from "../Card"
import { Separator } from "../ui/separator"
import { sanitizeStrings } from "~/lib/sanitizeStrings"

export const TopGrid = ({ posts }: { posts: PostPreview[] }) => {
  const sanitizedPosts = Object.values(sanitizeStrings<PostPreview[]>(posts))
  return (
    <div className="grid grid-cols-1 grid-rows-1 gap-8 sm:grid-cols-2 md:grid-cols-[repeat(4,_1fr)] md:grid-rows-[repeat(1,_1fr)]">
      <div className="gap-8 sm:col-span-2 md:col-span-2 md:col-start-2 md:row-span-2">
        <div className="flex flex-col gap-8">
          <Card post={sanitizedPosts[0]} showExcerpt isLarge />
          <Separator orientation="horizontal" className="my-2 h-0.5" />
          <Card post={sanitizedPosts[5]} showExcerpt hideImage />
        </div>
      </div>
      <div className="col-span-1 gap-8 md:col-start-1 md:row-span-1 md:row-start-1">
        <div className="flex flex-col gap-8">
          <Card post={sanitizedPosts[1]} showExcerpt />
          <Card post={sanitizedPosts[2]} showExcerpt />
        </div>
      </div>
      <div className="col-span-1 gap-8 md:col-start-4 md:row-span-1 md:row-start-1">
        <div className="flex flex-col gap-8">
          <Card post={sanitizedPosts[3]} showExcerpt />
          <Card post={sanitizedPosts[4]} showExcerpt />
        </div>
      </div>
    </div>
  )
}
