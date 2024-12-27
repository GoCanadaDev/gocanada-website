import { Layout } from "~/components/Layout"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { json, LoaderFunction, HeadersFunction } from "react-router"
import { getStaticPageByRoute, StaticPage } from "~/sanity/queries/staticPages"
import { client } from "~/sanity/client"
import { MetaFunction, useLoaderData } from "@remix-run/react"
import { PortableText } from "@portabletext/react"
import PortableTextComponents from "~/components/portable"
import { useOtherLanguage } from "~/lib/useOtherLanguage"
import Prose from "~/components/portable/Prose"
import { HeroImage } from "~/components/HeroImage"
import { getSiteConfig, SiteConfigType } from "~/sanity/queries/siteConfig"
import { genericMetaTags } from "~/lib/utils"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: StaticPageLoaderData
}) => {
  const title = `About | ${data.siteConfig.siteTitle}`
  const description = data.siteConfig.siteDescription
  return genericMetaTags({
    title,
    description,
    canonical: "/en/about",
  })
}

type StaticPageLoaderData = {
  staticPage: StaticPage
  siteConfig: SiteConfigType
}

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)

  const staticPage = await getStaticPageByRoute(client, params.lang, "/about")
  const siteConfig = await getSiteConfig(client)

  return json(
    { staticPage, siteConfig },
    {
      status: 200,
      headers: {
        // Always revalidate in the browser
        "Cache-Control": "public, max-age=0, must-revalidate",
        // Cache for a year in the CDN
        "Netlify-CDN-Cache-Control": "public, s-maxage=31536000",
        // Purge from the cache whenever the static page changes
        "Cache-Tag": `static-pages:${staticPage?._id}`,
      },
    }
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders

const About = () => {
  const { staticPage } = useLoaderData<StaticPageLoaderData>()
  const otherLanguage = useOtherLanguage()

  return (
    <Layout translationUrl={`/${otherLanguage}/about`}>
      <article className="mb-24 mt-8">
        <div className="w-full">
          <HeroImage
            fullBleed={staticPage.mainImageFullBleed}
            id={staticPage.mainImage.id}
            title={staticPage.title[staticPage.language]}
            category={undefined}
            preview={staticPage.mainImage.preview}
            mainImageCaption={staticPage.mainImageCaption}
            mainImageAttribution={staticPage.mainImageAttribution}
            mainImageAttributionUrl={staticPage.mainImageAttributionUrl}
            mainImageGradientOverlay={staticPage.mainImageGradientOverlay}
            hotspot={staticPage.mainImage.hotspot}
            crop={staticPage.mainImage.crop}
            aspectRatio={staticPage.mainImage.aspectRatio}
            isSponsored={false}
            sponsoredText={undefined}
          />
        </div>
        <Prose className="mt-4">
          <PortableText
            value={staticPage.body[staticPage.language]}
            components={PortableTextComponents}
          />
        </Prose>
      </article>
    </Layout>
  )
}

export default About
