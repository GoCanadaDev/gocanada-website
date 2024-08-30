import { redirect, type LoaderFunctionArgs } from "@remix-run/node"
import { validatePreviewUrl } from "@sanity/preview-url-secret"

import { client } from "~/sanity/client"
import { commitSession, getSession } from "../sessions"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (!process.env.SANITY_READ_TOKEN) {
    throw new Response("Draft mode missing token!", { status: 401 })
  }

  const clientWithToken = client.withConfig({
    // Required, otherwise the URL preview secret can't be validated
    token: process.env.SANITY_READ_TOKEN,
  })

  const { isValid, redirectTo = "/" } = await validatePreviewUrl(
    clientWithToken,
    request.url
  )

  if (!isValid) {
    throw new Response("Invalid secret!", { status: 401 })
  }

  const session = await getSession(request.headers.get("Cookie"))
  await session.set("projectId", client.config().projectId)

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  })
}
