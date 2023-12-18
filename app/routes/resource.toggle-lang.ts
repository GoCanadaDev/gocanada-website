import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"

import { langPreferenceCookie } from "~/cookies"
import getObjectFromFormData from "~/lib/getObjectFromFormData"

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = cookie.langPreference === `en` ? `fr` : `en`

  const formData = await request.formData()
  const formInput = getObjectFromFormData<{ translationUrl: string }>(formData)

  const headers = {
    "Set-Cookie": await langPreferenceCookie.serialize({
      langPreference,
    }),
  }

  if (formInput.translationUrl) {
    console.log("there was a translationUrl", formInput.translationUrl)
    return redirect(formInput.translationUrl, {
      headers,
    })
  }

  return json({ langPreference }, { headers })
}

export const loader: LoaderFunction = () => redirect("/", { status: 404 })
