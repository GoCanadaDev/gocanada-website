import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { z } from "zod"

import { langPreferenceCookie } from "~/cookies.server"
import type { SupportedLanguages } from "~/i18n"
import i18next from "~/i18next.server"

export const loader: LoaderFunction = async ({ request }) => {
  let locale = (await i18next.getLocale(request)) as SupportedLanguages

  const cookieHeader = request.headers.get("Cookie")
  const langCookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = z
    .union([z.literal("en"), z.literal("fr")])
    .optional()
    .parse(langCookie.langPreference)

  const currentLang = langPreference ?? locale

  if (!currentLang) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    })
  }

  return redirect(`/en`, {
    headers: {
      // Always revalidate in the browser
      "Cache-Control": "public, max-age=0, must-revalidate",
      // Cache for a year in the CDN
      "Netlify-CDN-Cache-Control": "public, durable, s-maxage=31536000",
      // Purge from the cache whenever the posts change
      "Cache-Tag": "posts",
    },
  })
}
