import { useEffect, useState } from "react"

import { Image } from "~/components/Image"
import { GalleryImagesProps } from "~/components/portable/GalleryImages/index"
import { AspectRatio } from "~/components/ui/aspect-ratio"
import { cn } from "~/lib/utils"

export const CarouselImages = ({ value }: GalleryImagesProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  if (!value || !value.images || value.images.length === 0) return null

  const toIndex = (index: number) => {
    const maxIndex = value.images.length - 1

    if (index < 0) {
      return setCurrentSlide(maxIndex)
    } else if (index > maxIndex) {
      return setCurrentSlide(0)
    }

    return setCurrentSlide(index)
  }

  // timer to auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      toIndex(currentSlide + 1)
    }, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [currentSlide])

  return (
    <div
      id="controls-carousel"
      className="relative w-full"
      data-carousel="static"
    >
      <AspectRatio ratio={3 / 2} className="overflow-hidden">
        {value?.images?.map((image, index) => {
          if (!image || !image.asset?._ref) {
            return null
          }
          return (
            <Image
              key={image.asset._ref}
              id={image.asset._ref}
              loading="lazy"
              className={cn(
                "pointer-events-none relative left-1/2 top-1/2 !m-0 w-full -translate-x-1/2 -translate-y-1/2 duration-700 ease-in-out",
                {
                  hidden: index !== currentSlide,
                }
              )}
              alt={image.alt ?? ""}
              mode="cover"
            />
          )
        })}

        <button
          type="button"
          className="group absolute start-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
          onClick={() => toIndex(currentSlide - 1)}
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70">
            <svg
              className="h-4 w-4 text-white rtl:rotate-180 dark:text-gray-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button
          type="button"
          className="group absolute end-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
          onClick={() => toIndex(currentSlide + 1)}
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70">
            <svg
              className="h-4 w-4 text-white rtl:rotate-180 dark:text-gray-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </AspectRatio>
    </div>
  )
}
