import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"

import { langPreferenceCookie } from "~/cookies"
import getObjectFromFormData from "~/lib/getObjectFromFormData"
import setLanguageCookie from "~/lib/setLanguageCookie"

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = cookie.langPreference === "en" ? "fr" : "en"

  const formData = await request.formData()
  const formInput = getObjectFromFormData<{ translationUrl: string }>(formData)

  const headers = { ...(await setLanguageCookie(langPreference)) }

  console.log({ redirect: formInput.translationUrl })

  return redirect(formInput.translationUrl, {
    headers,
  })
}

export const loader: LoaderFunction = () => redirect("/", { status: 404 })
