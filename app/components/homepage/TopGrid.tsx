import { PostPreview } from "~/sanity/queries"
import Card from "../Card"
import { Separator } from "../ui/separator"
import FrontAndCenterPostCarousel from "../FrontAndCenterPostCarousel"

export const TopGrid = ({
  featuredPosts,
  frontAndCenterPosts,
  mainPostCarouselCycleTime,
}: {
  featuredPosts: PostPreview[]
  frontAndCenterPosts: PostPreview[]
  mainPostCarouselCycleTime?: number
}) => {
  return (
    <div className="grid grid-cols-1 grid-rows-1 gap-8 sm:grid-cols-2 md:grid-cols-[repeat(4,_1fr)] md:grid-rows-[repeat(1,_1fr)]">
      <div className="gap-8 sm:col-span-2 md:col-span-2 md:col-start-2 md:row-span-2">
        <div className="flex flex-col gap-8">
          <FrontAndCenterPostCarousel
            posts={frontAndCenterPosts}
            mainPostCarouselCycleTime={mainPostCarouselCycleTime}
          />
          <Separator orientation="horizontal" className="my-2 h-0.5" />
          <Card
            post={featuredPosts[4]}
            showExcerpt
            hideImage
            loadingMode="lazy"
          />
        </div>
      </div>
      <div className="col-span-1 gap-8 md:col-start-1 md:row-span-1 md:row-start-1">
        <div className="flex flex-col gap-8">
          <Card post={featuredPosts[0]} showExcerpt loadingMode="eager" />
          <Card post={featuredPosts[1]} showExcerpt loadingMode="eager" />
        </div>
      </div>
      <div className="col-span-1 gap-8 md:col-start-4 md:row-span-1 md:row-start-1">
        <div className="flex flex-col gap-8">
          <Card post={featuredPosts[2]} showExcerpt loadingMode="eager" />
          <Card post={featuredPosts[3]} showExcerpt loadingMode="eager" />
        </div>
      </div>
    </div>
  )
}
