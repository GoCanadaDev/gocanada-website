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

  // Forward the request to SendGrid to process the ASM unsubscribe
  // SendGrid handles ASM unsubscribe automatically, but we need to forward the request
  // Even if it fails, we'll still show the confirmation page
  if (userId && data) {
    try {
      await new Promise<void>((resolve, reject) => {
        const queryString = new URLSearchParams({
          user_id: userId,
          data: data,
        }).toString()

        const httpReq = request(
          {
            headers: {
              host: "emails.gocanada.com",
            },
            hostname: ips[0],
            method: "GET",
            path: `/asm/unsubscribe/?${queryString}`,
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
      console.error("Error processing ASM unsubscribe with SendGrid:", error)
    }
  }

  // SendGrid processes the ASM unsubscribe automatically when the link is clicked
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
  path: "/asm/unsubscribe",
}
