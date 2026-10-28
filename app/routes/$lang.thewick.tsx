import { PortableText } from "@portabletext/react"
import type { HeadersFunction, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import type { MetaFunction } from "@remix-run/react"
import { useLoaderData } from "@remix-run/react"

import { HeroImage } from "~/components/HeroImage"
import { Layout } from "~/components/Layout"
import PortableTextComponents from "~/components/portable"
import Prose from "~/components/portable/Prose"
import { SubscribeForm } from "~/components/SubscribeForm"
import { isLangSupportedLang } from "~/lib/isLangSupportedLang"
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
  const title = `The Wick | ${data.siteConfig.siteTitle}`
  const description =
    "Go Canada x The Wickaninnish Inn Sweepstakes Official Rules"
  return genericMetaTags({
    title,
    description,
    canonical: "/en/thewick",
  })
}

type StaticPageLoaderData = {
  staticPage: StaticPage
  siteConfig: SiteConfigType
}

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)

  const staticPage = await getStaticPageByRoute(client, params.lang, "/thewick")
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

const TheWick = () => {
  const { staticPage } = useLoaderData<StaticPageLoaderData>()
  const otherLanguage = useOtherLanguage()

  const sweepstakesListItemTwo =
    staticPage.body[staticPage.language].findIndex(
      (block) => block.listItem === "number"
    ) + 2

  return (
    <Layout translationUrl={`/${otherLanguage}/thewick`}>
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
            value={[...staticPage.body[staticPage.language]].slice(
              0,
              sweepstakesListItemTwo
            )}
            components={PortableTextComponents}
          />
          <div className="mb-8 border border-zinc-300 bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <SubscribeForm pageLocation="thewick" />
          </div>
          <PortableText
            value={[...staticPage.body[staticPage.language]].slice(
              sweepstakesListItemTwo,
              staticPage.body[staticPage.language].length
            )}
            // value={staticPage.body[staticPage.language]}
            components={PortableTextComponents}
          />
        </Prose>
      </article>
    </Layout>
  )
}

export default TheWick
