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

type StaticPageLoaderData = {
  staticPage: StaticPage
}

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)

  const staticPage = await getStaticPageByRoute(client, params.lang, "/about")

  return json({ staticPage }, { status: 200 })
}

const Privacy = () => {
  const { staticPage } = useLoaderData() as StaticPageLoaderData
  const otherLanguage = useOtherLanguage()

  return (
    <Layout useMargins translationUrl={`/${otherLanguage}/about`}>
      <article className="holy-grail prose prose-slate mx-4 my-12 max-w-none lg:prose-lg dark:prose-invert prose-h1:font-serif prose-h2:font-serif prose-p:my-4  prose-a:text-brand hover:prose-a:text-brandHover prose-figure:my-4 prose-ol:my-0 prose-ol:ml-8 prose-ol:list-[lower-alpha] prose-ul:my-0 prose-li:my-0">
        <Typography.H1>{staticPage.title[staticPage.language]}</Typography.H1>
        <PortableText
          value={staticPage.body[staticPage.language]}
          components={PortableTextComponents}
        />
      </article>
    </Layout>
  )
}

export default Privacy
