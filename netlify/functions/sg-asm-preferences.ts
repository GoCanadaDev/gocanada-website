import type { Config, Context } from "@netlify/functions"
import { request } from "node:http"
import { resolve4 } from "node:dns"

export default async function (req: Request, context: Context) {
  const ips = await new Promise<string[]>((resolve, reject) => {
    resolve4("sendgrid.net", (err, addresses) => {
      if (err) {
        reject(err)
      }
      resolve(addresses)
    })
  })

  const url = new URL(req.url)
  const userId = url.searchParams.get("user_id")
  const data = url.searchParams.get("data")

  // Proxy the request to SendGrid and return the HTML response
  // SendGrid expects the preferences page to be served from the custom domain
  if (userId && data) {
    const queryString = new URLSearchParams({
      user_id: userId,
      data: data,
    }).toString()

    try {
      const response = await new Promise<{
        statusCode: number
        headers: Record<string, string | string[] | undefined>
        body: string
      }>((resolve, reject) => {
        const httpReq = request(
          {
            headers: {
              host: "emails.gocanada.com",
            },
            hostname: ips[0],
            method: "GET",
            path: `/asm/?${queryString}`,
            port: 80,
          },
          (res) => {
            let body = ""
            res.on("data", (chunk) => {
              body += chunk.toString()
            })
            res.on("end", () => {
              // Convert headers to a plain object
              const headers: Record<string, string | string[] | undefined> = {}
              Object.keys(res.headers).forEach((key) => {
                headers[key] = res.headers[key]
              })

              resolve({
                statusCode: res.statusCode || 200,
                headers,
                body,
              })
            })
          }
        )
        httpReq.on("close", () => {
          reject(new Error("Connection closed"))
        })
        httpReq.on("error", (err) => {
          reject(err)
        })
        httpReq.end()
      })

      // If SendGrid returns a redirect, follow it
      if (response.statusCode === 302 || response.statusCode === 301) {
        const location = response.headers.location
        if (location && typeof location === "string") {
          return new Response("", {
            headers: {
              location: location,
              "x-robots-tag": "nofollow, noindex",
            },
            status: response.statusCode,
          })
        }
      }

      // Proxy the HTML response from SendGrid
      // Filter out headers that shouldn't be forwarded
      const responseHeaders: Record<string, string> = {
        "x-robots-tag": "nofollow, noindex",
      }

      // Copy relevant headers from SendGrid's response
      if (response.headers["content-type"]) {
        responseHeaders["content-type"] =
          typeof response.headers["content-type"] === "string"
            ? response.headers["content-type"]
            : response.headers["content-type"][0]
      }

      return new Response(response.body, {
        status: response.statusCode,
        headers: responseHeaders,
      })
    } catch (error) {
      // Log error and return a user-friendly error page
      console.error(
        "Error proxying ASM preferences request to SendGrid:",
        error
      )
      return new Response(
        "Unable to load preferences page. Please try again later.",
        {
          status: 500,
          headers: {
            "content-type": "text/plain",
            "x-robots-tag": "nofollow, noindex",
          },
        }
      )
    }
  }

  // If parameters are missing, redirect to main site
  return new Response("", {
    headers: {
      location: "https://gocanada.com",
      "x-robots-tag": "nofollow, noindex",
    },
    status: 302,
  })
}

export const config: Config = {
  path: "/asm",
}
