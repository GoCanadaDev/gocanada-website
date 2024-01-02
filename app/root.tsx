import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"
import { useChangeLanguage } from "remix-i18next"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { langPreferenceCookie, themePreferenceCookie } from "~/cookies"
import { getBodyClassNames } from "~/lib/getBodyClassNames"
import { loadQuery } from "~/sanity/loader.server"
import { Category, getCategories, HOME_QUERY } from "~/sanity/queries"
import styles from "~/tailwind.css"
import type { HomeDocument } from "~/types/home"
import { homeZ } from "~/types/home"
import { getEnv } from "./env.server"
import VisualEditing from "./components/VisualEditing"
import i18next from "~/i18next.server"
import { Hydrated } from "./components/Hydrated"
import ErrorBoundaryPage from "./components/ErrorBoundaryPage"
import setLanguageCookie from "~/lib/setLanguageCookie"
import { SupportedLanguages } from "~/i18n"
import { sanitizeStrings } from "./lib/sanitizeStrings"
import { client } from "./sanity/client"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "preconnect", href: "https://cdn.sanity.io" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
    crossOrigin: "anonymous",
  },
  {
    href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;700&family=Inter:wght@500;700;800&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap",
    rel: "stylesheet",
  },
]

export const meta: MetaFunction = () => [
  {
    charset: "utf-8",
    title: "GoCanada",
    viewport: "width=device-width,initial-scale=1",
  },
]

export type RootLoaderData = {
  bodyClassNames: string
  categories: Category[]
  ENV: ReturnType<typeof getEnv>
  initial: any
  isStudioRoute: boolean
  locale: string
  params: {}
  query: string
  themePreference: string | undefined
  langPreference: SupportedLanguages | undefined
}

export const loader: LoaderFunction = async ({ request }) => {
  let locale = await i18next.getLocale(request)
  const cookieHeader = request.headers.get("Cookie")
  // Dark/light mode
  const themeCookie = (await themePreferenceCookie.parse(cookieHeader)) || {}
  const themePreference = z
    .union([z.literal("dark"), z.literal("light")])
    .optional()
    .parse(themeCookie.themePreference)

  // language cookie
  const langCookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = z
    .union([z.literal("en"), z.literal("fr")])
    .optional()
    .parse(langCookie.langPreference)

  let headers = {}
  if (!langPreference) {
    // set cookie to current locale, or default to english
    const lang = (locale ?? "en") as SupportedLanguages
    headers = { ...(await setLanguageCookie(lang)) }
  }

  const isStudioRoute = new URL(request.url).pathname.startsWith("/studio")
  const bodyClassNames = getBodyClassNames(themePreference)

  // Sanity content reused throughout the site
  const initial = await loadQuery<HomeDocument>(HOME_QUERY).then((res) => ({
    ...sanitizeStrings(res),
    data: res.data ? homeZ.parse(sanitizeStrings(res.data)) : null,
  }))

  const categories = await getCategories(client, locale)

  return json<RootLoaderData>(
    {
      bodyClassNames,
      categories,
      ENV: getEnv(),
      initial,
      isStudioRoute,
      locale,
      params: {},
      query: HOME_QUERY,
      themePreference,
      langPreference,
    },
    {
      headers,
    }
  )
}

export let handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "common",
}

export default function App() {
  const { locale, bodyClassNames, ENV, langPreference, isStudioRoute } =
    useLoaderData<typeof loader>()

  const { i18n } = useTranslation()

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(langPreference || locale)

  return (
    <html lang={langPreference || i18n.resolvedLanguage} dir={i18n.dir()}>
      <head>
        <Meta />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="https://fav.farm/🇨🇦" />
        <Links />
      </head>
      <body className={isStudioRoute ? undefined : bodyClassNames}>
        <Outlet />
        <ScrollRestoration />
        {ENV.SANITY_STUDIO_USE_STEGA ? (
          <Hydrated>
            <VisualEditing />
          </Hydrated>
        ) : null}
        <Scripts />
        {/* Add ENV variables on window so they are available client-side */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <LiveReload />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  return <ErrorBoundaryPage />
}
