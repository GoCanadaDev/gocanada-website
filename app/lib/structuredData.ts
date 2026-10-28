import type { Image } from "sanity"

import {
  type AuthorProfileKey,
  getAuthorProfileUrls,
} from "~/lib/authorProfileUrls"
import { urlForImage } from "~/lib/sanity.image"
import type { Author, PostPreview } from "~/sanity/queries"

const org = {
  // Stable identifier so publisher/WebSite nodes resolve to the same entity
  id: "https://gocanada.com/#organization",
  name: "Go Canada",
  alternateName: ["GoCanada.com", "@Canada"],
  url: "https://gocanada.com",
  logoUrl: "https://gocanada.com/images/android-chrome-192x192.png",
  description:
    "Go Canada (GoCanada.com) is a Canadian-owned travel publication and media company that owns and operates @Canada on Instagram (instagram.com/canada).",
  sameAs: ["https://www.instagram.com/canada/", "https://threads.net/canada"],
  parentOrganization: {
    name: "Stay & Wander Media Inc.",
    url: "https://www.stayandwander.com/",
  },
}

const orgReference = { "@id": org.id }

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": org.id,
    name: org.name,
    alternateName: org.alternateName,
    url: org.url,
    logo: org.logoUrl,
    description: org.description,
    sameAs: org.sameAs,
    parentOrganization: {
      "@type": "Organization",
      name: org.parentOrganization.name,
      url: org.parentOrganization.url,
    },
  }
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://gocanada.com",
    name: "Go Canada",
    publisher: orgReference,
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://gocanada.com/en/search?posts%5Bquery%5D={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }
}

// Listing pages can render hundreds of posts; cap what goes into the <head>
const MAX_BLOG_POSTS_IN_SCHEMA = 20

export function generateBlogSchema({
  description,
  url = org.url,
  posts = [],
}: {
  description: string
  url?: string
  posts?: PostPreview[]
}) {
  const blogPost = posts
    .filter((post) => post.slug?.en && post.title?.en)
    .slice(0, MAX_BLOG_POSTS_IN_SCHEMA)
    .map((post) => {
      const slug =
        typeof post.slug.en === "string" ? post.slug.en : post.slug.en.current
      return {
        "@type": "BlogPosting",
        headline: post.title.en,
        url: `https://gocanada.com/en/${slug}`,
        ...(post.mainImage?.url && { image: post.mainImage.url }),
        ...(post.author?.name && {
          author: { "@type": "Person", name: post.author.name },
        }),
        datePublished: post.publishedAt,
        dateModified: post._updatedAt || post.publishedAt,
      }
    })

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Go Canada",
    url,
    description,
    publisher: {
      "@type": "Organization",
      ...orgReference,
      name: org.name,
      logo: {
        "@type": "ImageObject",
        url: org.logoUrl,
      },
    },
    ...(blogPost.length > 0 && { blogPost }),
  }
}

export function getAuthorPageUrl(slug: string) {
  return `https://gocanada.com/en/authors/${slug}`
}

type PersonSchemaAuthor = Pick<
  Author,
  "name" | "slug" | "bio" | "image" | AuthorProfileKey
>

// Same @id on author pages and articles so search engines merge them into one Person
export function generatePersonSchema(author: PersonSchemaAuthor) {
  const url = getAuthorPageUrl(author.slug)
  const description = author.bio?.en?.trim()
  const imageUrl = author.image
    ? urlForImage(author.image as unknown as Image)
        ?.width(400)
        .url()
    : undefined
  const sameAs = getAuthorProfileUrls(author)

  return {
    "@type": "Person",
    "@id": `${url}#person`,
    name: author.name,
    url,
    ...(description && { description }),
    ...(imageUrl && { image: imageUrl }),
    ...(sameAs.length > 0 && { sameAs }),
  }
}

export function generateProfilePageSchema(author: PersonSchemaAuthor) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: getAuthorPageUrl(author.slug),
    mainEntity: generatePersonSchema(author),
  }
}

type PostSchemaBase = {
  title: string
  description: string
  url: string
  imageUrl: string
  author: PersonSchemaAuthor
  datePublished: string
  dateModified?: string
}

export function generateBlogPostingSchema({
  title,
  description,
  url,
  imageUrl,
  author,
  datePublished,
  dateModified,
}: PostSchemaBase) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: imageUrl,
    author: generatePersonSchema(author),
    publisher: {
      "@type": "Organization",
      ...orgReference,
      name: org.name,
      logo: {
        "@type": "ImageObject",
        url: org.logoUrl,
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }
}

export function generateBreadcrumbSchema(
  paths: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: paths.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      item: p.url,
    })),
  }
}
