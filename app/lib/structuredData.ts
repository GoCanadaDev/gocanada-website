import type { PostPreview } from "~/sanity/queries"

const org = {
  name: "Go Canada",
  url: "https://gocanada.com",
  logoUrl: "https://gocanada.com/images/android-chrome-192x192.png",
  sameAs: ["https://instagram.com/canada", "https://threads.net/canada"],
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    url: org.url,
    logo: org.logoUrl,
    sameAs: org.sameAs,
  }
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://gocanada.com",
    name: "Go Canada",
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
      name: org.name,
      logo: {
        "@type": "ImageObject",
        url: org.logoUrl,
      },
    },
    ...(blogPost.length > 0 && { blogPost }),
  }
}

type PostSchemaBase = {
  title: string
  description: string
  url: string
  imageUrl: string
  authorName: string
  datePublished: string
  dateModified?: string
}

export function generateBlogPostingSchema({
  title,
  description,
  url,
  imageUrl,
  authorName,
  datePublished,
  dateModified,
}: PostSchemaBase) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: imageUrl,
    author: { "@type": "Person", name: authorName },
    publisher: {
      "@type": "Organization",
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
