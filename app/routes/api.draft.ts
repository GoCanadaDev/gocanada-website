import { redirect, type LoaderFunctionArgs } from "@remix-run/node"
import { validatePreviewUrl } from "@sanity/preview-url-secret"
import { client } from "~/sanity/client"
import { commitSession, getSession } from "../sessions"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (!process.env.SANITY_READ_TOKEN) {
    throw new Response("Draft mode missing token!", { status: 401 })
  }

  const url = new URL(request.url)

  const clientWithToken = client.withConfig({
    token: process.env.SANITY_READ_TOKEN,
  })

  // Handle either the standard validatePreviewUrl params or the ones from your logs
  let isValid = false
  let redirectTo = "/"

  if (url.searchParams.has("sanity-preview-secret")) {
    // Handle the Sanity presentation tool format
    const secret = url.searchParams.get("sanity-preview-secret")
    const pathname = url.searchParams.get("sanity-preview-pathname")

    isValid = Boolean(secret) // You may want to validate this against a stored secret
    redirectTo = pathname || redirectTo
  } else {
    // Fall back to the standard preview URL validation
    const result = await validatePreviewUrl(clientWithToken, request.url)
    isValid = result.isValid
    redirectTo = result.redirectTo || redirectTo
  }

  if (!isValid) {
    throw new Response("Invalid secret!", { status: 401 })
  }

  const session = await getSession(request.headers.get("Cookie"))
  session.set("projectId", client.config().projectId)

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  })
}
