import { renderToString } from "react-dom/server"
import type { InstantSearchServerState } from "react-instantsearch"
import { getServerState } from "react-instantsearch"
import { json } from "@remix-run/node"
import { MetaFunction, useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/node"
import { Typography } from "~/components/Typography"
import { useTranslate } from "~/lib/useTranslate"
import { Layout } from "~/components/Layout"
import { themePreferenceCookie } from "~/cookies.server"
import { z } from "zod"
import { SSRSearchProvider } from "~/components/search"
import { SITE_META } from "~/lib/utils"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: SearchProps
}) => {
  const title = data.query
    ? `[${data.query}] Results from ${SITE_META.siteTitle}`
    : `Search | ${SITE_META.siteTitle}`

  return [
    { title },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:title", content: title },
    { property: "og:title", content: title },
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  const serverUrl = request.url
  const serverState = await getServerState(<Search serverUrl={serverUrl} />, {
    renderToString,
  })
  const query = new URL(request.url).searchParams.get("posts[query]")

  const cookieHeader = request.headers.get("Cookie")
  const themeCookie = (await themePreferenceCookie.parse(cookieHeader)) || {}
  const themePreference = z
    .union([z.literal("dark"), z.literal("light")])
    .optional()
    .parse(themeCookie.themePreference)

  return json({
    query,
    serverState,
    serverUrl,
    themePreference,
  })
}

type SearchProps = {
  query?: string
  serverState?: InstantSearchServerState
  serverUrl?: string
  themePreference?: "dark" | "light"
}

function Search({ serverState, serverUrl, themePreference }: SearchProps) {
  const { translations } = useTranslate()

  return (
    <div>
      <Typography.H1>{translations.search}</Typography.H1>
      <SSRSearchProvider
        themePreference={themePreference}
        serverState={serverState}
        serverUrl={serverUrl}
      />
    </div>
  )
}

export default function SearchPage() {
  const { serverState, serverUrl, query, themePreference } =
    useLoaderData() as SearchProps

  return (
    <Layout useMargins>
      <Search
        serverState={serverState}
        serverUrl={serverUrl}
        query={query}
        themePreference={themePreference}
      />
    </Layout>
  )
}
