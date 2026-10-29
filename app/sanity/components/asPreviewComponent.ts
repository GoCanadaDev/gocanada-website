import type { ComponentType } from "react"
import type { PreviewProps } from "sanity"

/**
 * Lets a frontend component be used as a Studio preview. Sanity spreads the
 * `preview.select` values into the preview props at runtime, but the
 * `PreviewProps` type doesn't model them.
 */
export function asPreviewComponent<P extends object>(
  Component: ComponentType<P>
) {
  return Component as unknown as ComponentType<PreviewProps>
}
