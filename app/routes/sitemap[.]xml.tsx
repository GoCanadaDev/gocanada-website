import { LoaderFunction } from "@remix-run/node"
import { client } from "~/sanity/client"
import { getSitemapSlugs, SitemapSlugs } from "~/sanity/queries/sitemap"

const renderXML = (sitemapSlugs: SitemapSlugs[]) => {
  const url = "https://www.gocanada.com"

  const sourceXML = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${`${url}/en`}</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
    ${sitemapSlugs
      .filter(Boolean)
      .map((item) => {
        if (!item.slug) return ""
        if (item.subCategories?.length) {
          return `
          <url>
            <loc>${url}/${item.slug}</loc>
          </url>
          ${item.subCategories
            .map((subCategory) => {
              if (!subCategory.slug) return ""
              return `
                <url>
                  <loc>${url}/${subCategory.slug}</loc>
                  <priority>0.6</priority>
                </url>
              `
            })
            .join("")}
        `
        }
        return `
          <url>
            <loc>${url}/${item.slug}</loc>
             <priority>0.8</priority>
          </url>
        `
      })
      .join("")}}
  </urlset>`

  return sourceXML
}

export const loader: LoaderFunction = async () => {
  const sitemapSlugs = await getSitemapSlugs(client)

  return new Response(renderXML(sitemapSlugs), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "x-content-type-options": "nosniff",
      "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
    },
  })
}
