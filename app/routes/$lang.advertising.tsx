import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { json, LoaderFunction } from "@remix-run/node"
import { getStaticPageByRoute, StaticPage } from "~/sanity/queries/staticPages"
import { client } from "~/sanity/client"
import { useLoaderData } from "@remix-run/react"
import { PortableText } from "@portabletext/react"
import PortableTextComponents from "~/components/PortableTextComponents"
import { useOtherLanguage } from "~/lib/useOtherLanguage"
import Prose from "~/components/portable/Prose"
import { HeroImage } from "~/components/HeroImage"

type StaticPageLoaderData = {
  staticPage: StaticPage
}

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)

  const staticPage = await getStaticPageByRoute(
    client,
    params.lang,
    "/advertising"
  )

  return json({ staticPage }, { status: 200 })
}

const Advertising = () => {
  const { staticPage } = useLoaderData() as StaticPageLoaderData
  const otherLanguage = useOtherLanguage()

  return (
    <Layout translationUrl={`/${otherLanguage}/advertising`}>
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
            hotspot={staticPage.mainImage.hotspot}
            crop={staticPage.mainImage.crop}
            aspectRatio={staticPage.mainImage.aspectRatio}
            isSponsored={false}
            sponsoredText={undefined}
          />
        </div>
        <Prose>
          <Typography.H1>{staticPage.title[staticPage.language]}</Typography.H1>
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
