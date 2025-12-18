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

  // For preferences, we can either:
  // 1. Redirect directly to SendGrid's preferences page
  // 2. Forward the request and then redirect to our own page with an iframe
  //
  // Option 1: Direct redirect (simpler, but user leaves your domain)
  if (userId && data) {
    const queryString = new URLSearchParams({
      user_id: userId,
      data: data,
    }).toString()

    // Redirect to SendGrid's preferences page
    // SendGrid will handle the preferences management
    return new Response("", {
      headers: {
        location: `https://${ips[0]}/asm/preferences/?${queryString}`,
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
