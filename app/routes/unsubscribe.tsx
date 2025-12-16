import type { LoaderFunction } from "@remix-run/node"
import type { MetaFunction } from "@remix-run/react"
import { useLoaderData, useNavigate } from "@remix-run/react"

import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { Button } from "~/components/ui/button"
import { genericMetaTags } from "~/lib/utils"
import { client } from "~/sanity/client"
import type { SiteConfigType } from "~/sanity/queries/siteConfig"
import { getSiteConfig } from "~/sanity/queries/siteConfig"
import GoCanadaLogoRed from "../../public/images/logotype-red.png"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: { siteConfig: SiteConfigType }
}) => {
  const title = `Unsubscribed | ${data.siteConfig.siteTitle}`
  const description = data.siteConfig.siteDescription
  return genericMetaTags({ title, description })
}

export const loader: LoaderFunction = async ({ request }) => {
  const siteConfig = await getSiteConfig(client)

  return {
    siteConfig,
  }
}

export default function Unsubscribe() {
  const { siteConfig } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  return (
    <Layout>
      <article className="text-center">
        <div className="holy-grail mx-4 my-24 max-w-none space-y-8 text-xl">
          <div className="flex justify-center">
            <img
              src={GoCanadaLogoRed}
              alt="Go Canada Logo"
              className="w-32 md:w-48"
              width={192}
              height={37}
            />
          </div>
          <Typography.H1>You've been unsubscribed</Typography.H1>
          <Typography.Paragraph>
            You have been successfully unsubscribed from the Go Canada
            newsletter. You will no longer receive emails from us.
          </Typography.Paragraph>
          <Typography.TextMuted>
            We're sorry to see you go! If you change your mind, you can always
            subscribe again from our homepage.
          </Typography.TextMuted>

          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() => navigate("/")}
              variant="default"
            >
              Return to GoCanada.com
            </Button>
          </div>
        </div>
      </article>
    </Layout>
  )
}
