import type {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"
import { json } from "@remix-run/node"
import { useChangeLanguage } from "remix-i18next"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Layout } from "~/components/Layout"
import { themePreferenceCookie } from "~/cookies"
import { getBodyClassNames } from "~/lib/getBodyClassNames"
import { useQuery } from "~/sanity/loader"
import { loadQuery } from "~/sanity/loader.server"
import { HOME_QUERY } from "~/sanity/queries"
import styles from "~/tailwind.css"
import type { HomeDocument } from "~/types/home"
import { homeZ } from "~/types/home"
import { getEnv } from "./env.server"
import VisualEditing from "./components/VisualEditing"
import i18next from "~/i18next.server"
import { Hydrated } from "./components/Hydrated"
import ErrorBoundaryPage from "./components/ErrorBoundaryPage"

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
    title: "New Remix App",
    viewport: "width=device-width,initial-scale=1",
  },
]

export type LoaderData = {
  bodyClassNames: string
  ENV: ReturnType<typeof getEnv>
  initial: any
  isStudioRoute: boolean
  locale: string
  params: {}
  query: string
  themePreference: string | undefined
}

export const loader: LoaderFunction = async ({ request }) => {
  let locale = await i18next.getLocale(request)
  // Dark/light mode
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await themePreferenceCookie.parse(cookieHeader)) || {}
  const themePreference = z
    .union([z.literal("dark"), z.literal("light")])
    .optional()
    .parse(cookie.themePreference)

  const isStudioRoute = new URL(request.url).pathname.startsWith("/studio")
  const bodyClassNames = getBodyClassNames(themePreference)

  // Sanity content reused throughout the site
  const initial = await loadQuery<HomeDocument>(HOME_QUERY).then((res) => ({
    ...res,
    data: res.data ? homeZ.parse(res.data) : null,
  }))

  return json<LoaderData>({
    bodyClassNames,
    ENV: getEnv(),
    initial,
    isStudioRoute,
    locale,
    params: {},
    query: HOME_QUERY,
    themePreference,
  })
}

export let handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "common",
}

export default function App() {
  const { initial, locale, query, params, bodyClassNames, isStudioRoute, ENV } =
    useLoaderData<typeof loader>()
  const { data, loading } = useQuery<typeof initial.data>(query, params, {
    initial,
  })

  let { i18n } = useTranslation()

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale)

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <Meta />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="https://fav.farm/🇨🇦" />
        <Links />
      </head>
      <body className={bodyClassNames}>
        {isStudioRoute ? (
          <Outlet />
        ) : (
          <Layout home={loading || !data ? null : data}>
            <Outlet />
          </Layout>
        )}
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

export function ErrorBoundary({ error }: { error: string }) {
  return <ErrorBoundaryPage error={error?.toString()} />
}
