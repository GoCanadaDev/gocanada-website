import type { Config, Context } from "@netlify/functions"
import { type IncomingHttpHeaders, request } from "node:http"
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

  // Forward the request to SendGrid and get the response
  // Similar to how click tracking works - SendGrid will return a redirect or content
  if (userId && data) {
    const queryString = new URLSearchParams({
      user_id: userId,
      data: data,
    }).toString()

    try {
      const headers = await new Promise<IncomingHttpHeaders>(
        (resolve, reject) => {
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
              res.on("data", () => {})
              res.on("end", () => {
                resolve(res.headers)
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
        }
      )

      // If SendGrid returns a location header, redirect to it
      if (headers.location) {
        return new Response("", {
          headers: {
            location: headers.location,
            "x-robots-tag": "nofollow, noindex",
          },
          status: 302,
        })
      }
    } catch (error) {
      // Log error but continue to fallback redirect
      console.error(
        "Error forwarding ASM preferences request to SendGrid:",
        error
      )
    }

    // Fallback: redirect to SendGrid's preferences page if no location header
    return new Response("", {
      headers: {
        location: `https://sendgrid.net/asm/preferences/?${queryString}`,
        "x-robots-tag": "nofollow, noindex",
      },
      status: 302,
    })
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
