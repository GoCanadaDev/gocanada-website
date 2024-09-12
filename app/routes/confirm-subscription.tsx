import type { LoaderFunction } from "@remix-run/node"
import { ClientRequest } from "@sendgrid/client/src/request"
import sendgrid from "~/lib/sendgrid"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { LogoIcon } from "~/components/LogoIcon"
import { Button } from "~/components/ui/button"
import { MetaFunction, useLoaderData, useNavigate } from "@remix-run/react"
import { client } from "~/sanity/client"
import { getSiteConfig, SiteConfigType } from "~/sanity/queries/siteConfig"
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "./resource.og"
import { genericMetaTags } from "~/lib/utils"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: { siteConfig: SiteConfigType }
}) => {
  const title = `Confirm Subscription | ${data.siteConfig.siteTitle}`
  const description = data.siteConfig.siteDescription
  return genericMetaTags({ title, description })
}

export const loader: LoaderFunction = async ({ request }) => {
  let { searchParams } = new URL(request.url)
  let email = searchParams.get("email")
  let pathname = searchParams.get("pathname")
  let pageLocation = searchParams.get("pageLocation")

  const siteConfig = await getSiteConfig(client)

  const data = {
    contacts: [
      {
        email,
        custom_fields: {
          signup_from_page: pathname ?? "",
          form_location: pageLocation ?? "",
        },
      },
    ],
  }

  if (email) {
    const req = {
      url: `/v3/marketing/contacts`,
      method: "PUT",
      body: data,
    }
    await sendgrid
      .request(req as ClientRequest)
      .then(([response, body]) => {
        console.log({ status: response.statusCode })
        console.log({ body })
      })
      .catch((error) => {
        console.error({
          error,
        })
      })
  }

  return {
    email,
    siteConfig,
  }
}

export default function ConfirmSubscription() {
  const { email } = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  return (
    <Layout>
      <article className="text-center">
        <div className="holy-grail mx-4 my-24 max-w-none space-y-8 text-xl">
          <div className="flex justify-center">
            <LogoIcon />
          </div>
          <Typography.H1>
            {email ? "Subscription Confirmed" : "Something went wrong"}
          </Typography.H1>
          {email ? (
            <>
              <Typography.Paragraph>
                Thank you <strong> {email}</strong> for subscribing to the Go
                Canada Newsletter. We look forward to bringing you the latest in
                travel stories, important information, special offers, giveaways
                and more.
              </Typography.Paragraph>
              <Typography.TextMuted>
                You will be able to update your preferences or unsubscribe at
                any time.
              </Typography.TextMuted>
            </>
          ) : (
            <>
              <Typography.Paragraph>
                We were unable to confirm your subscription. Please try again.
              </Typography.Paragraph>
            </>
          )}

          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() => navigate("/")}
              className="gap-2 bg-brand hover:bg-brandHover dark:bg-brand dark:text-white dark:hover:bg-brandHover"
            >
              Go Home
            </Button>
          </div>
        </div>
      </article>
    </Layout>
  )
}
