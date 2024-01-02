import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import isLangSupportedLang from "~/sanity/queries/isLangSupportedLang"
import { json, LoaderFunction } from "@remix-run/node"

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)

  return json({}, { status: 200 })
}

const Privacy = () => {
  return (
    <Layout useMargins>
      <Typography.H1>Advertising</Typography.H1>
      <Typography.TextSmall>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
      </Typography.TextSmall>
    </Layout>
  )
}

export default Privacy
