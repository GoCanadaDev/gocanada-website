import { PostPreview } from "~/sanity/queries"
import Card from "./Card"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Fade from "embla-carousel-fade"
import { useRef, useState } from "react"
import { DotButton, useDotButton } from "./ui/useDotButton"
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./ui/usePrevNextButtons"
import { cn } from "~/lib/utils"
import { useAutoplayProgress } from "./ui/useAutoplayProgress"
import { useAutoplay } from "./ui/useAutoplay"
import { Play, Pause } from "lucide-react"

type FrontAndCenterPostCarouselProps = {
  posts: PostPreview[]
  mainPostCarouselCycleTime?: number | null
}

const FrontAndCenterPostCarousel = ({
  posts,
  mainPostCarouselCycleTime,
}: FrontAndCenterPostCarouselProps) => {
  const postsArray = Object.values(posts)

  if (postsArray.length === 1) {
    return (
      <div>
        <Card post={posts[0]} showExcerpt isLarge loadingMode="eager" />
      </div>
    )
  }

  const [api, setApi] = useState<CarouselApi>()

  const progressNode = useRef<HTMLDivElement>(null)

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(api)

  const { showAutoplayProgress } = useAutoplayProgress(api, progressNode)
  const { autoplayIsPlaying, toggleAutoplay, onAutoplayButtonClick } =
    useAutoplay(api)

  const autoplay = api?.plugins()?.autoplay

  return (
    <Carousel
      setApi={setApi}
      plugins={[
        Autoplay({
          playOnInit: true,
          delay:
            typeof mainPostCarouselCycleTime === "number"
              ? mainPostCarouselCycleTime * 1000
              : 5000,
          stopOnInteraction: true,
        }),
        Fade(),
      ]}
    >
      <CarouselContent
        onMouseEnter={() => autoplay?.stop()}
        onMouseLeave={() => autoplay?.play()}
      >
        {postsArray.map((post) => (
          <CarouselItem key={post._createdAt}>
            <Card
              post={post}
              showExcerpt
              isLarge
              disableImageTransition
              loadingMode="eager"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-2 items-center gap-2">
          <PrevButton
            onClick={() => onAutoplayButtonClick(onPrevButtonClick)}
            disabled={prevBtnDisabled}
          />
          <NextButton
            onClick={() => onAutoplayButtonClick(onNextButtonClick)}
            disabled={nextBtnDisabled}
          />
        </div>
        <div className="flex gap-1">
          <button
            className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 dark:text-zinc-400 hover:dark:bg-zinc-800"
            onClick={toggleAutoplay}
            type="button"
          >
            {autoplayIsPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <div
            className={cn(
              "relative h-2 w-32 max-w-[90%] self-center justify-self-center overflow-hidden rounded-3xl bg-white shadow-[inset_0_0_0_0.1rem_hsl(var(--border))] transition-opacity duration-300 ease-in-out dark:bg-zinc-900",
              {
                "opacity-50": !showAutoplayProgress,
              }
            )}
          >
            <div
              className={cn(
                "absolute -left-full bottom-0 top-0 w-full animate-[autoplay-progress_linear_1] bg-brand motion-reduce:animate-none",
                { "[animation-play-state:paused]": !showAutoplayProgress }
              )}
              ref={progressNode}
            />
          </div>
        </div>
        <div className="-mr-[0.6rem] flex flex-wrap items-center justify-end">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={cn(
                "relative m-0 flex h-10 w-10 cursor-pointer appearance-none items-center justify-center rounded-full border-0 bg-transparent p-0 after:h-5 after:w-5 after:rounded-full after:shadow-[inset_0_0_0_0.1rem_hsl(var(--border))] after:content-['']",
                {
                  "after:shadow-[inset_0_0_0_0.2rem_#bf2327]":
                    index === selectedIndex,
                }
              )}
            />
          ))}
        </div>
      </div>
    </Carousel>
  )
}

export default FrontAndCenterPostCarousel
