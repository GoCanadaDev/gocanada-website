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
import { Suspense } from "react"
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
import { ClientPerspective, ContentSourceMap } from "@sanity/client"

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
  initial: {
    data: {
      title: string | null
      siteTitle: string | null
    } | null
    sourceMap?: ContentSourceMap | undefined
    perspective?: ClientPerspective | undefined
  }
  query: typeof HOME_QUERY
  params: {}
  bodyClassNames: string
  isStudioRoute: boolean
  ENV: ReturnType<typeof getEnv>
}

const getInitial = async () =>
  await loadQuery<HomeDocument>(HOME_QUERY).then((res) => ({
    ...res,
    data: res.data ? homeZ.parse(res.data) : null,
  }))

export const loader: LoaderFunction = async ({ request }) => {
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
    initial,
    query: HOME_QUERY,
    params: {},
    bodyClassNames,
    isStudioRoute,
    ENV: getEnv(),
  })
}

export default function App() {
  const { initial, query, params, bodyClassNames, isStudioRoute, ENV } =
    useLoaderData<LoaderData>()
  const { data, loading } = useQuery<typeof initial.data>(query, params, {
    initial,
  })

  return (
    <html lang="en">
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
          <Suspense>
            <VisualEditing />
          </Suspense>
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
