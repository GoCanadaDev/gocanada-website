import { resolve } from "node:path"

import type { EntryContext } from "@remix-run/node"
import { RemixServer } from "@remix-run/react"
import * as Sentry from "@sentry/remix"
import { createInstance } from "i18next"
import Backend from "i18next-fs-backend"
import { isbot } from "isbot"
import { renderToPipeableStream } from "react-dom/server"
import { I18nextProvider, initReactI18next } from "react-i18next"
import { PassThrough } from "stream"
import { z } from "zod"

import { langPreferenceCookie } from "./cookies.server"
import { getEnv } from "./env.server"
import i18n from "./i18n" // your i18n configuration file
import i18next from "./i18next.server"

export const handleError = Sentry.wrapHandleErrorWithSentry(
  (error, { request }) => {
    // Custom handleError implementation
  }
)

const ABORT_DELAY = 5000

// put ENV on the global namespace, so it's available in any server code
global.ENV = getEnv()

// noinspection JSUnusedGlobalSymbols
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady"

  const cookieHeader = request.headers.get("Cookie")
  const langCookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = z
    .union([z.literal("en"), z.literal("fr")])
    .optional()
    .parse(langCookie.langPreference)

  let instance = createInstance()
  let lng = langPreference ?? (await i18next.getLocale(request))
  let ns = i18next.getRouteNamespaces(remixContext)

  await instance
    .use(initReactI18next) // Tell our instance to use react-i18next
    .use(Backend) // Set up our backend
    .init({
      ...i18n, // spread the configuration
      lng, // The locale we detected above
      ns, // The namespaces the routes about to render wants to use
      backend: { loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json") },
      preload: ["en", "fr"],
    })

  return new Promise((resolve, reject) => {
    let didError = false

    let { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={instance}>
        <RemixServer context={remixContext} url={request.url} />
      </I18nextProvider>,
      {
        [callbackName]: () => {
          let body = new PassThrough()

          responseHeaders.set("Content-Type", "text/html")

          // French translations are on hold, so keep /fr pages out of search
          if (/^\/fr(\/|$)/.test(new URL(request.url).pathname)) {
            responseHeaders.set("X-Robots-Tag", "noindex")
          }

          resolve(
            // @ts-ignore
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          )

          pipe(body)
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onError(error: unknown) {
          didError = true

          console.error(error)
        },
      }
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
