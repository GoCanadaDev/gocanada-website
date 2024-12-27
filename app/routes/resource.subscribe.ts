import type { ActionFunction, LoaderFunction } from "react-router"
import { redirect } from "react-router"
import sendgridMail from "@sendgrid/mail"

import { langPreferenceCookie } from "~/cookies.server"
import getObjectFromFormData from "~/lib/getObjectFromFormData"

sendgridMail.setApiKey(String(process.env.SENDGRID_API_KEY))

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const formInput = getObjectFromFormData<{
    email: string
    pathname?: string
    pageLocation?: string
  }>(formData)

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
  }
  await sendgridMail.send(msg)

  return null
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = cookie.langPreference

  return redirect(`/${langPreference}`, { status: 404 })
}
