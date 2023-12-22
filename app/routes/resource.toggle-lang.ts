import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"

import { langPreferenceCookie } from "~/cookies"
import getObjectFromFormData from "~/lib/getObjectFromFormData"
import setLanguageCookie from "~/lib/setLanguageCookie"

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = cookie.langPreference === `en` ? `fr` : `en`

  const formData = await request.formData()
  const formInput = getObjectFromFormData<{ translationUrl: string }>(formData)

  const headers = { ...(await setLanguageCookie(langPreference)) }

  if (formInput.translationUrl) {
    return redirect(formInput.translationUrl, {
      headers,
    })
  }

  return json({ langPreference }, { headers })
}

export const loader: LoaderFunction = () => redirect("/", { status: 404 })
