import * as Sentry from "@sentry/react"
import { useLocation, useMatches } from "react-router"
import { HydratedRouter } from "react-router/dom"
import { startTransition, StrictMode, useEffect } from "react"
import ReactDOM from "react-dom/client"
import i18n from "./i18n"
import i18next from "i18next"
import { I18nextProvider, initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"
import { getInitialNamespaces } from "remix-i18next/client"
import { createBrowserRouter } from "react-router"
import routes from "./routes"

if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: "https://034299a6e749e9fba9aaea38fc46cda2@o456660.ingest.us.sentry.io/4508132492640256",
    tracesSampleRate: 1,

    integrations: [
      Sentry.browserTracingIntegration({
        useEffect,
        useLocation,
        useMatches,
      }),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
  })
}

async function hydrate() {
  await i18next
    .use(initReactI18next) // Tell i18next to use the react-i18next plugin
    .use(LanguageDetector) // Setup a client-side language detector
    .use(Backend) // Setup your backend
    .init({
      ...i18n, // spread the configuration
      // This function detects the namespaces your routes rendered while SSR use
      ns: getInitialNamespaces(),
      backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" },
      detection: {
        // Here only enable htmlTag detection, we'll detect the language only
        // server-side with remix-i18next, by using the `<html lang>` attribute
        // we can communicate to the client the language detected server-side
        order: ["htmlTag"],
        // Because we only use htmlTag, there's no reason to cache the language
        // on the browser, so we disable it
        caches: [],
      },
    })

  const root = document.getElementById("root")
  if (!root) {
    throw new Error("Root element not found")
  }

  ReactDOM.hydrateRoot(
    root,
    <I18nextProvider i18n={i18next}>
      <StrictMode>
        <HydratedRouter />
      </StrictMode>
    </I18nextProvider>
  )
}

hydrate()
