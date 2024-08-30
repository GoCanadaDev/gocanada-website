import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { ClientRequest } from "@sendgrid/client/src/request"
import sendgrid from "@sendgrid/client"

import { langPreferenceCookie } from "~/cookies.server"
import getObjectFromFormData from "~/lib/getObjectFromFormData"

sendgrid.setApiKey(String(process.env.SENDGRID_API_KEY))

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const formInput = getObjectFromFormData<{
    email: string
    pathname?: string
    pageLocation?: string
  }>(formData)

  const data = {
    contacts: [
      {
        email: formInput.email,
        custom_fields: {
          signup_from_page: formInput.pathname ?? "",
          form_location: formInput.pageLocation ?? "",
        },
      },
    ],
  }

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

  return redirect(`${request.headers.get("Referer")}?submitted`)
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = cookie.langPreference

  return redirect(`/${langPreference}`, { status: 404 })
}
