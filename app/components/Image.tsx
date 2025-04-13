import { SanityImage } from "sanity-image"
import { dataset, projectId } from "~/sanity/projectDetails"
const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/`

// Docs here https://github.com/coreyward/sanity-image
export const Image = (
  props: Omit<
    React.ComponentProps<typeof SanityImage>,
    "baseUrl" | "dataset" | "projectId"
  > & {
    sizes?: string
    srcSet?: string
  }
) => {
  const { sizes, srcSet, ...rest } = props

  // Generate srcSet if not provided
  const defaultSrcSet =
    srcSet ||
    `${baseUrl}${props.id}?w=400 400w, ${baseUrl}${props.id}?w=800 800w, ${baseUrl}${props.id}?w=1200 1200w, ${baseUrl}${props.id}?w=1600 1600w`

  // Default sizes if not provided
  const defaultSizes =
    sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"

  return (
    <SanityImage
      baseUrl={baseUrl}
      id={props.id}
      {...rest}
      className={props.className}
      srcSet={defaultSrcSet}
      sizes={defaultSizes}
    />
  )
}
