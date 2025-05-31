import * as Sentry from "@sentry/remix"

Sentry.init({
  dsn: "https://034299a6e749e9fba9aaea38fc46cda2@o456660.ingest.us.sentry.io/4508132492640256",
  tracesSampleRate: 0.1,
  autoInstrumentRemix: true,
})
