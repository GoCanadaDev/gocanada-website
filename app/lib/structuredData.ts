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

export function generateBlogSchema({ description }: { description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Go Canada",
    url: "https://gocanada.com",
    description,
    publisher: {
      "@type": "Organization",
      name: org.name,
      logo: {
        "@type": "ImageObject",
        url: org.logoUrl,
      },
    },
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
