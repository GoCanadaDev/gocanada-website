import { Layout } from "~/components/Layout"
import type { LoaderFunction } from "@remix-run/node"
import type { MetaFunction } from "@remix-run/react"
import type { SiteConfigType } from "~/sanity/queries/siteConfig"
import SubscribeForm from "~/components/SubscribeForm"
import { Typography } from "~/components/Typography"
import { client } from "~/sanity/client"
import { genericMetaTags } from "~/lib/utils"
import { getSiteConfig } from "~/sanity/queries/siteConfig"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: { siteConfig: SiteConfigType }
}) => {
  const title = `Newsletter | ${data.siteConfig.siteTitle}`
  const description = data.siteConfig.siteDescription
  return genericMetaTags({ title, description })
}

export const loader: LoaderFunction = async () => {
  const siteConfig = await getSiteConfig(client)

  return {
    siteConfig,
  }
}

export default function Newsletter() {
  return (
    <Layout>
      <article className="text-center">
        <div className="holy-grail mx-4 my-24 max-w-none space-y-8 text-xl">
          <Typography.H1>Sign up for the Go Canada newsletter</Typography.H1>

          <>
            <Typography.Paragraph>
              Receive the latest in travel info and inspiration, plus insider
              tips, giveaways and special offers, right in your inbox.
            </Typography.Paragraph>
            <div className="mb-8 border border-zinc-300 bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <SubscribeForm pageLocation="newsletter" />
            </div>
          </>
        </div>
      </article>
    </Layout>
  )
}
