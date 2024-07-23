import { SanityImage } from "sanity-image"
import { cn } from "~/lib/utils"

import { dataset, projectId } from "~/sanity/projectDetails"
const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/`

// Docs here https://github.com/coreyward/sanity-image
export const Image = (
  props: Omit<
    React.ComponentProps<typeof SanityImage>,
    "baseUrl" | "dataset" | "projectId"
  > & { disablePointerEvents?: boolean }
) => (
  <SanityImage
    baseUrl={baseUrl}
    id={props.id}
    {...props}
    className={cn(
      props.disablePointerEvents ? "pointer-events-none" : "",
      props.className
    )}
  />
)
