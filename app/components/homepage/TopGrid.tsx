import type { PostPreview } from "~/sanity/queries"

import { Card } from "../Card"
import { Typography } from "../Typography"

export const TopGrid = ({
  featuredPosts,
}: {
  featuredPosts: PostPreview[]
}) => {
  return (
    <div>
      <Typography.H2 className="pb-4 font-sans text-xl uppercase tracking-widest">
        Latest Stories
      </Typography.H2>
      <div className="grid grid-cols-1 grid-rows-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        <Card post={featuredPosts[0]} showExcerpt loadingMode="eager" />
        <Card post={featuredPosts[1]} showExcerpt loadingMode="eager" />
        <Card post={featuredPosts[2]} showExcerpt loadingMode="eager" />
        <div className="block md:hidden">
          <Card post={featuredPosts[3]} showExcerpt loadingMode="eager" />
        </div>
      </div>
    </div>
  )
}
