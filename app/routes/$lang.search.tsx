import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import type { MetaFunction } from "@remix-run/react"
import { useLoaderData } from "@remix-run/react"
import { renderToString } from "react-dom/server"
import { useTranslation } from "react-i18next"
import type { InstantSearchServerState } from "react-instantsearch"
import { getServerState } from "react-instantsearch"
import { z } from "zod"

import { Layout } from "~/components/Layout"
import { SSRSearchProvider } from "~/components/search"
import { Typography } from "~/components/Typography"
import { themePreferenceCookie } from "~/cookies.server"
import {
  generateBlogSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "~/lib/structuredData"
import { genericMetaTags, SITE_META } from "~/lib/utils"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: SearchProps
}) => {
  const title = data.query
    ? `[${data.query}] Results from ${SITE_META.siteTitle}`
    : `Search | ${SITE_META.siteTitle}`
  const description = "Search results from Go Canada"
  const canonical = `https://gocanada.com/en/search`

  return genericMetaTags({
    title,
    description: "",
    canonical,
    schemas: [
      generateOrganizationSchema(),
      generateWebsiteSchema(),
      generateBlogSchema({ description }),
      generateBreadcrumbSchema([
        {
          name: "Home",
          url: "https://gocanada.com/en",
        },
        {
          name: "Search",
          url: canonical,
        },
      ]),
    ],
  })
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
  // can't use useTranslate here because it's not a child of the root loader
  const { t } = useTranslation()

  return (
    <div>
      <Typography.H1>{t("search")}</Typography.H1>
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
    useLoaderData<SearchProps>()

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
