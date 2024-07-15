import { LoaderFunction, redirect } from "@remix-run/node"
import i18next from "~/i18next.server"
import { SupportedLanguages } from "~/i18n"
import { langPreferenceCookie } from "~/cookies.server"
import { z } from "zod"

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

  return redirect(`/${currentLang}`)
}
