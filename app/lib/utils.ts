import { MetaDescriptor } from "@remix-run/node"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "~/routes/resource.og"
import posthog from "posthog-js"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const trackEvent = (eventName: string, rest: Record<string, any>) => {
  posthog.capture(eventName, { ...rest })
}

export const SITE_META = {
  title: "Go Canada",
  siteTitle: "Go Canada",
}

export const genericMetaTags = ({
  title,
  description,
  canonical,
  schemas,
}: {
  title: string
  description: string
  canonical?: string
  schemas?: Record<string, unknown>[]
}) => {
  const imageAlt = "White logo for Go Canada on a red background"
  const meta: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:title", content: title },
    { property: "twitter:site", content: "@gocanada" },
    { property: "twitter:description", content: description },
    { property: "twitter:image", content: "/images/og-main.png" },
    { property: "twitter:image:alt", content: imageAlt },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://gocanada.com/en" },
    { property: "og:title", content: title },
    { property: "og:site_name", content: "Go Canada" },
    { property: "og:locale", content: "en_CA" },
    { property: "og:description", content: description },
    { property: "og:image:width", content: String(OG_IMAGE_WIDTH) },
    { property: "og:image:height", content: String(OG_IMAGE_HEIGHT) },
    { property: "og:image", content: "/images/og-main.png" },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:alt", content: imageAlt },
  ]

  if (canonical) {
    meta.push({
      tagName: "link",
      rel: "canonical",
      href: canonical,
    })
  }

  if (schemas) {
    schemas.forEach((schema) => {
      meta.push({
        "script:ld+json": schema,
      })
    })
  }

  return meta
}
