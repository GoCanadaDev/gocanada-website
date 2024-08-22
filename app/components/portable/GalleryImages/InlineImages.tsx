import { GalleryImagesProps } from "~/components/portable/GalleryImages/index"
import { Image } from "~/components/Image"
import { useEffect, useState } from "react"

export const InlineImages = ({ value }: GalleryImagesProps) => {
  if (!value) return null
  const [shortestHeight, setShortestHeight] = useState<number | "100%">("100%")

  function getWindowDimensions() {
    if (typeof window === "undefined") return { width: 0, height: 0 }
    const { innerWidth: width, innerHeight: height } = window
    return {
      width,
      height,
    }
  }

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (windowDimensions.width > 768) {
      const images = document.querySelectorAll(`.grid-item-${value._key} img`)

      // Get the rendered heights of each image
      const heights = Array.from(images).map((img) => img.clientHeight)

      // Get the shortest height
      const minHeight = Math.min(...heights)

      setShortestHeight(minHeight)
    } else {
      setShortestHeight("100%")
    }
  }, [value, windowDimensions])

  return (
    <figure
      className={`grid grid-cols-1 gap-8 md:grid-cols-${value.images.length}`}
    >
      {value?.images
        .filter((image) => image?.asset?._ref)
        .map((image) => (
          <div
            key={image.asset._ref}
            className={`flex items-center justify-center overflow-hidden grid-item-${value._key}`}
            style={{
              maxHeight: shortestHeight,
            }}
          >
            <Image
              id={image.asset._ref}
              alt={image.alt ?? ""}
              width={640}
              loading="lazy"
              className="pointer-events-none !m-0 w-full"
            />
          </div>
        ))}
    </figure>
  )
}
