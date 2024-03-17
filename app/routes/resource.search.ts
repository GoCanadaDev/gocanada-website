import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"

import { langPreferenceCookie } from "~/cookies"
import getObjectFromFormData from "~/lib/getObjectFromFormData"

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = cookie.langPreference

  const formData = await request.formData()
  const formInput = getObjectFromFormData<{ search: string }>(formData)

  console.log({ formInput })

  return redirect(
    `/${langPreference}/search?posts%5Bquery%5D=${encodeURI(formInput.search)}`
  )
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = cookie.langPreference

  return redirect(`/${langPreference}`, { status: 404 })
}
