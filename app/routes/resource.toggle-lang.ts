import type { ActionFunction, LoaderFunction } from "react-router"
import { redirect } from "react-router"

import { langPreferenceCookie } from "~/cookies.server"
import getObjectFromFormData from "~/lib/getObjectFromFormData"
import setLanguageCookie from "~/lib/setLanguageCookie"

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = cookie.langPreference === "en" ? "fr" : "en"

  const formData = await request.formData()
  const formInput = getObjectFromFormData<{ translationUrl: string }>(formData)

  const headers = { ...(await setLanguageCookie(langPreference)) }

  return redirect(
    formInput.translationUrl === ""
      ? `/${langPreference}`
      : formInput.translationUrl,
    {
      headers,
    }
  )
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = cookie.langPreference === "en" ? "fr" : "en"

  return redirect(`/${langPreference}`, { status: 404 })
}
