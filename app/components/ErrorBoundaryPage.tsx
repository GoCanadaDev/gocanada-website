import { AlertTriangle } from "lucide-react"
import { Layout } from "./Layout"
import {
  isRouteErrorResponse,
  useRouteError,
  Links,
  Meta,
  Scripts,
  Link,
} from "@remix-run/react"
import { Typography } from "./Typography"
import { getBodyClassNames } from "~/lib/getBodyClassNames"

export default function ErrorBoundaryPage() {
  const error = useRouteError()
  const bodyClassNames = getBodyClassNames("")

  console.error("isRouteErrorResponse", isRouteErrorResponse(error))

  return (
    <html>
      <head>
        <title>Something went wrong | GoCanada</title>
        <Meta />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <Links />
      </head>
      <body className={bodyClassNames}>
        <Layout useMargins>
          <div className="flex items-center justify-center">
            <div className="flex w-5/6 max-w-[800px] flex-col space-y-8 rounded-lg bg-slate-100 p-8 shadow dark:bg-slate-800">
              <div className="flex w-full items-center justify-center">
                <AlertTriangle size={72} className="text-red-500" />
              </div>
              <Typography.H1 className="w-full text-center">
                {isRouteErrorResponse(error)
                  ? `${error.status} ${error.statusText}`
                  : "Something went wrong"}
              </Typography.H1>
              <div className="flex w-full justify-between sm:mb-6">
                <Typography.Paragraph className="text-center">
                  Please refresh the page and try again, or start over at the{" "}
                  <Link
                    to="/"
                    className="text-red-600 underline hover:text-red-500"
                  >
                    home page
                  </Link>
                  . If the problem persists, please reach out to {/* TODO */}
                  <span className="italic">support@gocanada.com.</span>
                </Typography.Paragraph>
              </div>
              {error instanceof Error && (
                <details className="max-h-[200px] w-full overflow-auto rounded bg-red-100 p-4">
                  <summary>{error.message}</summary>

                  <pre className="mt-4 whitespace-normal text-xs sm:text-sm">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </Layout>
        <Scripts />
      </body>
    </html>
  )
}
