import { client } from "~/sanity/client"
import { purgeCache } from "@netlify/functions"
import {
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from "@remix-run/node"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { langPreferenceCookie } from "~/cookies.server"

export interface WebhookBody {
  ids: {
    created: string[]
    updated: string[]
    deleted: string[]
  }
}

export const action: ActionFunction = async ({ request }) => {
  const json = await request.json()

  console.log("Webhook body", json)

  // await purgeCache({
  //   tags: [
  //     "posts",
  //     `posts:id:${post._id}`,
  //     `posts:category:${post.category}`,
  //     `posts:category:${post.category}:subCategory:${post.subCategory}`,
  //   ],
  // })

  return null
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = cookie.langPreference === "en" ? "fr" : "en"

  return redirect(`/${langPreference}`, { status: 404 })
}
