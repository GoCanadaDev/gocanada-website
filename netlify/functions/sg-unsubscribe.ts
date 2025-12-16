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
  const upn = url.searchParams.get("upn")
  if (!upn) {
    return new Response("Missing upn parameter", { status: 400 })
  }

  // Make request to SendGrid to process the unsubscribe
  // Even if it fails, we'll still show the confirmation page
  try {
    await new Promise<void>((resolve, reject) => {
      const httpReq = request(
        {
          headers: {
            host: "emails.gocanada.com",
          },
          hostname: ips[0],
          method: "GET",
          path: `/wf/unsubscribe?upn=${encodeURIComponent(upn)}`,
          port: 80,
        },
        (res) => {
          res.on("data", () => {})
          res.on("end", () => {
            resolve()
          })
        }
      )
      httpReq.on("close", () => {
        resolve()
      })
      httpReq.on("error", () => {
        // Still resolve even on error - SendGrid may have processed it
        resolve()
      })
      httpReq.end()
    })
  } catch (error) {
    // Log error but continue to show confirmation page
    console.error("Error processing unsubscribe with SendGrid:", error)
  }

  // SendGrid processes the unsubscribe automatically when the link is clicked
  // We redirect to our custom confirmation page on the main domain
  return new Response("", {
    headers: {
      location: "https://gocanada.com/unsubscribe",
      "x-robots-tag": "nofollow, noindex",
    },
    status: 302,
  })
}

export const config: Config = {
  path: "/wf/unsubscribe",
}
