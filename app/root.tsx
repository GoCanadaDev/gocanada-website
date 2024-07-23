import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
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
import {
  langPreferenceCookie,
  themePreferenceCookie,
  gdprConsent,
} from "~/cookies.server"
import { getBodyClassNames } from "~/lib/getBodyClassNames"
import { Category, Partner, getCategories, getPartners } from "~/sanity/queries"
import styles from "~/tailwind.css"
import { getEnv } from "./env.server"
import VisualEditing from "./components/VisualEditing"
import i18next from "~/i18next.server"
import { Hydrated } from "./components/Hydrated"
import ErrorBoundaryPage from "./components/ErrorBoundaryPage"
import setLanguageCookie from "~/lib/setLanguageCookie"
import { SupportedLanguages } from "~/i18n"
import { client } from "./sanity/client"
import { getFooterLinks, StaticPageRoute } from "~/sanity/queries/staticPages"
import { CookieBanner } from "./components/CookieBanner"
import { useTranslations } from "./lib/useTranslations"
import { TranslationKey } from "./lib/flattenMessages"

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
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@500;700;800&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&family=Rasa:ital,wght@0,300..700;1,300..700&display=swap",
    rel: "stylesheet",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/images/apple-touch-icon.png",
  },
  {
    rel: "icon",
    sizes: "32x32",
    href: "/images/favicon-32x32.png",
  },
  {
    rel: "icon",
    sizes: "16x16",
    href: "/images/favicon-16x16.png",
  },
  {
    rel: "manifest",
    sizes: "16x16",
    href: "/site.webmanifest",
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
  footerLinks: StaticPageRoute[]
  isStudioRoute: boolean
  langPreference: SupportedLanguages | undefined
  locale: string
  params: {}
  partners: Partner[]
  showCookieBanner: boolean
  themePreference: string | undefined
  translations: Record<TranslationKey, string>
  viewAll: string
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const cookieHeader = request.headers.get("Cookie")
  const gdprCookie = (await gdprConsent.parse(cookieHeader)) || {}

  if (formData.get("accept-gdpr") === "true") {
    gdprCookie.gdprConsent = true
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": await gdprConsent.serialize(gdprCookie),
    },
  })
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

  // GDPR cookie
  const gdprCookie = (await gdprConsent.parse(cookieHeader)) || {}

  let headers = {}
  if (!langPreference) {
    // set cookie to current locale, or default to english
    const lang = (locale ?? "en") as SupportedLanguages
    headers = { ...(await setLanguageCookie(lang)) }
  }

  const isStudioRoute = new URL(request.url).pathname.startsWith("/studio")
  const bodyClassNames = getBodyClassNames(themePreference)

  const categories = await getCategories(client, locale)
  const footerLinks = await getFooterLinks(client, locale)
  const partners = await getPartners(client)

  let t = await i18next.getFixedT(request)
  let viewAll = t("viewAll")
  const translations = await useTranslations(t)

  return json<RootLoaderData>(
    {
      bodyClassNames,
      categories,
      ENV: getEnv(),
      footerLinks,
      isStudioRoute,
      langPreference,
      locale,
      params: {},
      partners,
      showCookieBanner: !gdprCookie.gdprConsent,
      themePreference,
      translations,
      viewAll,
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
  const {
    locale,
    bodyClassNames,
    ENV,
    langPreference,
    isStudioRoute,
    showCookieBanner,
  } = useLoaderData<typeof loader>()

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
        <Links />
      </head>
      <body className={isStudioRoute ? undefined : bodyClassNames}>
        <Outlet />
        {showCookieBanner && <CookieBanner />}
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
