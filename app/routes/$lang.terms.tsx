import { PortableText } from "@portabletext/react"
import { HeadersFunction, json, LoaderFunction } from "@remix-run/node"
import { MetaFunction, useLoaderData } from "@remix-run/react"
import { HeroImage } from "~/components/HeroImage"
import { Layout } from "~/components/Layout"
import PortableTextComponents from "~/components/portable"
import Prose from "~/components/portable/Prose"
import { Typography } from "~/components/Typography"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { useOtherLanguage } from "~/lib/useOtherLanguage"
import { genericMetaTags } from "~/lib/utils"
import { client } from "~/sanity/client"
import { getSiteConfig, SiteConfigType } from "~/sanity/queries/siteConfig"
import { getStaticPageByRoute, StaticPage } from "~/sanity/queries/staticPages"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: StaticPageLoaderData
}) => {
  const title = `Terms | ${data.siteConfig.siteTitle}`
  const description = data.siteConfig.siteDescription
  return genericMetaTags({ title, description })
}

type StaticPageLoaderData = {
  staticPage: StaticPage
  siteConfig: SiteConfigType
}

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)

  const staticPage = await getStaticPageByRoute(client, params.lang, "/terms")
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
        "Cache-Tag": "static-pages:terms",
      },
    }
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders

const TermsOfUse = () => {
  const { staticPage } = useLoaderData() as StaticPageLoaderData
  const otherLanguage = useOtherLanguage()

  return (
    <Layout translationUrl={`/${otherLanguage}/terms`}>
      <article className="mb-24 mt-8">
        {staticPage.mainImage ? (
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
        ) : (
          <Prose className="text-center">
            <Typography.H1>
              {staticPage.title[staticPage.language]}
            </Typography.H1>
          </Prose>
        )}
        <Prose>
          <PortableText
            value={staticPage.body[staticPage.language]}
            components={PortableTextComponents}
          />
        </Prose>
      </article>
    </Layout>
  )
}

export default TermsOfUse
