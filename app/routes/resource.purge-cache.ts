import { client } from "~/sanity/client"
import { purgeCache } from "@netlify/functions"
import type { ActionFunction } from "@remix-run/node"
import { sanitizeStrings } from "~/lib/sanitizeStrings"

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
