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
  const upn = url.searchParams.get("upn")

  const headers = await new Promise<IncomingHttpHeaders>((resolve, reject) => {
    const httpReq = request(
      {
        headers: {
          host: "emails.gocanada.com",
        },
        hostname: ips[0],
        method: "GET",
        path: "/ls/click?upn=" + (upn ? encodeURIComponent(upn) : ""),
        port: 80,
      },
      (res) => {
        res.on("data", () => {})
        res.on("end", () => {
          resolve(res.headers)
        })
      }
    )
    httpReq.on("close", () => {})
    httpReq.on("error", (err) => {
      reject(err)
    })
    httpReq.end()
  })

  return new Response("", {
    headers: {
      location: headers.location || "https://gocanada.com",
      "x-robots-tag": "nofollow, noindex",
    },
    status: 302,
  })
}

export const config: Config = {
  path: "/ls/click",
}
