import type { ActionFunction, LoaderFunction } from "@remix-run/node"

import { ClientRequest } from "@sendgrid/client/src/request"
import getObjectFromFormData from "~/lib/getObjectFromFormData"
import { langPreferenceCookie } from "~/cookies.server"
import { redirect } from "@remix-run/node"
import sendgrid from "@sendgrid/client"
import sendgridMail from "@sendgrid/mail"

sendgrid.setApiKey(String(process.env.SENDGRID_API_KEY))
sendgridMail.setApiKey(String(process.env.SENDGRID_API_KEY))

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
    .then(async ([response, body]) => {
      console.log({ status: response.statusCode })
      console.log({ body })
      // after successful signup, send welcome email
      const msg = {
        to: formInput.email,
        from: {
          email: "news@gocanada.com",
          name: "Go Canada",
        },
        templateId: "d-6ae7e3266ecb405fa8d8bb6d42056d10",
        dynamicTemplateData: {
          email: formInput.email,
          pathname: formInput.pathname ?? "",
          pageLocation: formInput.pageLocation ?? "",
        },
        asm: {
          groupId: 30038,
          groupsToDisplay: [30038],
        },
      }
      await sendgridMail.send(msg)
    })
    .catch((error) => {
      console.error({
        error,
      })
    })

  return null
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = cookie.langPreference

  return redirect(`/${langPreference}`, { status: 404 })
}
