import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { json, LoaderFunction } from "@remix-run/node"
import { getStaticPageByRoute, StaticPage } from "~/sanity/queries/staticPages"
import { client } from "~/sanity/client"
import { useLoaderData } from "@remix-run/react"
import { PortableText } from "@portabletext/react"
import PortableTextComponents from "~/components/portable"
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

  // https://gocanadadev.github.io/video/JONA%20JAMES%20x%20CANADA%20draft%204.mov
  // https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4

  return (
    <Layout translationUrl={`/${otherLanguage}/advertising`}>
      <article className="mb-24 mt-8">
        <div className="w-full">
          <video playsInline autoPlay loop muted>
            <source src={staticPage.videoUrl} type="video/mp4" />
          </video>
        </div>

        <Prose>
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
