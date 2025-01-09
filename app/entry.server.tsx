import * as Sentry from "@sentry/node"
import {
  EntryContext,
  type HandleErrorFunction,
  ServerRouter,
} from "react-router"
import { PassThrough } from "stream"
import { isbot } from "isbot"
import { renderToPipeableStream } from "react-dom/server"
import { createInstance } from "i18next"
import i18next from "./i18next.server"
import { I18nextProvider, initReactI18next } from "react-i18next"
import Backend from "i18next-fs-backend"
import i18n from "./i18n" // your i18n configuration file
import { resolve } from "node:path"

import { getEnv } from "./env.server"
import { langPreferenceCookie } from "./cookies.server"
import { z } from "zod"
import routes from "./routes" // Your React Router v7 route configuration

export const handleError: HandleErrorFunction = (error, { request }) => {
  if (!request.signal.aborted) {
    Sentry.captureException(error)
    console.error(error)
  }
}

const ABORT_DELAY = 5000

global.ENV = getEnv()

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  entryContext: EntryContext
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

  const i18nInstance = createInstance()
  const lng = langPreference ?? (await i18next.getLocale(request))
  const ns = i18next.getRouteNamespaces(entryContext)

  await i18nInstance
    .use(initReactI18next)
    .use(Backend)
    .init({
      ...i18n,
      lng,
      ns,
      backend: { loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json") },
      preload: ["en", "fr"],
    })

  // const handler = createStaticHandler(routes)
  // const context = await handler.query(request.url)

  // const router = createStaticRouter(routes, context)

  return new Promise((resolve, reject) => {
    let didError = false

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={i18nInstance}>
        <ServerRouter context={entryContext} url={request.url} />
      </I18nextProvider>,
      {
        [callbackName]: () => {
          const body = new PassThrough()

          responseHeaders.set("Content-Type", "text/html")

          resolve(
            // @ts-ignore
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          )

          pipe(body)
        },
        onShellError(error) {
          reject(error)
        },
        onError(error) {
          didError = true
          console.error(error)
        },
      }
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
