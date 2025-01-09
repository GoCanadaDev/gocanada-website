import type { LoaderFunction } from "react-router"
import type { MetaFunction } from "react-router"
import { useLoaderData, useNavigate } from "react-router"
import type { ClientRequest } from "@sendgrid/client/src/request"

import { Layout } from "~/components/Layout"
import { Logo } from "~/components/Logo"
import { Typography } from "~/components/Typography"
import { Button } from "~/components/ui/button"
import sendgrid from "~/lib/sendgrid"
import { genericMetaTags } from "~/lib/utils"
import { client } from "~/sanity/client"
import type { SiteConfigType } from "~/sanity/queries/siteConfig"
import { getSiteConfig } from "~/sanity/queries/siteConfig"
import GoCanadaLogoRed from "/images/logotype-red.png"

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
            <img
              src={GoCanadaLogoRed}
              alt="Go Canada Logo"
              className="w-32 md:w-48"
              width={192}
              height={37}
            />
          </div>
          <Typography.H1>
            {email ? "Subscription Confirmed" : "Something went wrong"}
          </Typography.H1>
          {email ? (
            <>
              <Typography.Paragraph>
                Thank you <strong> {email}</strong> for subscribing to the Go
                Canada Newsletter. Your subscription has been confirmed.
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
              variant="default"
            >
              Explore GoCanada.com
            </Button>
          </div>
        </div>
      </article>
    </Layout>
  )
}
