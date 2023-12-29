import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"

import { themePreferenceCookie, langPreferenceCookie } from "~/cookies"

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await themePreferenceCookie.parse(cookieHeader)) || {}
  const themePreference = cookie.themePreference === `dark` ? `light` : `dark`

  return redirect(request.headers.get("Referer") || "/", {
    headers: {
      "Set-Cookie": await themePreferenceCookie.serialize({
        themePreference,
      }),
    },
  })
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = cookie.langPreference === "en" ? "fr" : "en"

  return redirect(`/${langPreference}`, { status: 404 })
}
