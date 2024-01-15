import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import isLangSupportedLang from "~/sanity/queries/isLangSupportedLang"
import { json, LoaderFunction } from "@remix-run/node"
import { getStaticPageByRoute, StaticPage } from "~/sanity/queries/staticPages"
import { client } from "~/sanity/client"
import { useLoaderData } from "@remix-run/react"
import { PortableText } from "@portabletext/react"
import PortableTextComponents from "~/components/PortableTextComponents"
import { useOtherLanguage } from "~/lib/useOtherLanguage"

type StaticPageLoaderData = {
  staticPage: StaticPage
}

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)

  const staticPage = await getStaticPageByRoute(client, params.lang, "/media")

  return json({ staticPage }, { status: 200 })
}

const Privacy = () => {
  const { staticPage } = useLoaderData() as StaticPageLoaderData
  const otherLanguage = useOtherLanguage()

  return (
    <Layout useMargins translationUrl={`/${otherLanguage}/media`}>
      <Typography.H1>{staticPage.title[staticPage.language]}</Typography.H1>
      <PortableText
        value={staticPage.body[staticPage.language]}
        components={PortableTextComponents}
      />
    </Layout>
  )
}

export default Privacy
