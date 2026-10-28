import { PortableText } from "@portabletext/react"
import type {
  HeadersFunction,
  LoaderFunction,
  LoaderFunctionArgs,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import type { MetaFunction } from "@remix-run/react"
import { useLoaderData } from "@remix-run/react"

import { HeroImage } from "~/components/HeroImage"
import { Layout } from "~/components/Layout"
import PortableTextComponents from "~/components/portable"
import Prose from "~/components/portable/Prose"
import { isLangSupportedLang } from "~/lib/isLangSupportedLang"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { useOtherLanguage } from "~/lib/useOtherLanguage"
import { genericMetaTags } from "~/lib/utils"
import { client } from "~/sanity/client"
import type { SiteConfigType } from "~/sanity/queries/siteConfig"
import { getSiteConfig } from "~/sanity/queries/siteConfig"
import type { StaticPage } from "~/sanity/queries/staticPages"
import { getStaticPageByRoute } from "~/sanity/queries/staticPages"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: StaticPageLoaderData
}) => {
  const sanitizedData = sanitizeStrings(data)
  const ogImageUrl = sanitizedData ? sanitizedData.ogImageUrl : undefined
  const title = `Sweepstakes | ${data.siteConfig.siteTitle}`
  const description = `Enter the latest ${data.siteConfig.siteTitle} sweepstakes for a chance to win travel-inspired prizes.`
  return genericMetaTags({
    title,
    description,
    canonical: "/en/sweepstakes",
    image: ogImageUrl ? { url: ogImageUrl } : undefined,
  })
}

type StaticPageLoaderData = {
  staticPage: StaticPage
  siteConfig: SiteConfigType
  ogImageUrl: string
}

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderFunctionArgs) => {
  isLangSupportedLang(params.lang)

  const staticPage = await getStaticPageByRoute(
    client,
    params.lang,
    "/sweepstakes"
  )
  const siteConfig = await getSiteConfig(client)
  const { origin } = new URL(request.url)
  const ogImageUrl = `${origin}/resource/og?id=${staticPage?._id}`

  return json(
    { staticPage, siteConfig, ogImageUrl },
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

const Sweepstakes = () => {
  const { staticPage } = useLoaderData<StaticPageLoaderData>()
  const otherLanguage = useOtherLanguage()

  return (
    <Layout translationUrl={`/${otherLanguage}/sweepstakes`}>
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

export default Sweepstakes
