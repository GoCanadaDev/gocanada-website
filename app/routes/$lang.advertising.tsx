import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { json, LoaderFunction, HeadersFunction } from "react-router"
import { getStaticPageByRoute, StaticPage } from "~/sanity/queries/staticPages"
import { client } from "~/sanity/client"
import { MetaFunction, useLoaderData } from "@remix-run/react"
import { PortableText } from "@portabletext/react"
import PortableTextComponents from "~/components/portable"
import { useOtherLanguage } from "~/lib/useOtherLanguage"
import Prose from "~/components/portable/Prose"
import { getSiteConfig, SiteConfigType } from "~/sanity/queries/siteConfig"
import { genericMetaTags } from "~/lib/utils"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: StaticPageLoaderData
}) => {
  const title = `Advertising | ${data.siteConfig.siteTitle}`
  const description = data.siteConfig.siteDescription
  return genericMetaTags({
    title,
    description,
    canonical: "/en/advertising",
  })
}

type StaticPageLoaderData = {
  staticPage: StaticPage
  siteConfig: SiteConfigType
}

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)

  const staticPage = await getStaticPageByRoute(
    client,
    params.lang,
    "/advertising"
  )
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

const Advertising = () => {
  const { staticPage } = useLoaderData<StaticPageLoaderData>()
  const otherLanguage = useOtherLanguage()

  return (
    <Layout translationUrl={`/${otherLanguage}/advertising`}>
      <article className="mb-24 mt-8">
        <div className="w-full">
          <video
            playsInline
            autoPlay
            loop
            muted
            poster="https://gocanadadev.github.io/video/cover.png"
            className="h-auto w-screen object-cover"
          >
            <source src={staticPage.videoUrl} type="video/mp4" />
          </video>
        </div>

        <Prose className="text-center">
          <Typography.H1>{staticPage.title[staticPage.language]}</Typography.H1>
        </Prose>

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

export default Advertising
