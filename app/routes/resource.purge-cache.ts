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
  _id: string
  _type: "postType" | "categoryType" | "subCategoryType" | "staticPageType"
}

export const action: ActionFunction = async ({ request }) => {
  const json = await request.json()
  const { _type, _id } = json as WebhookBody

  if (_type === "postType") {
    await purgeCache({
      tags: ["posts", `posts:id:${_id}`],
    })
  } else if (_type === "categoryType") {
    await purgeCache({
      tags: [`posts:category:${_id}`],
    })
  } else if (_type === "subCategoryType") {
    await purgeCache({
      tags: [`subCategory:${_id}`],
    })
  } else if (_type === "staticPageType") {
    await purgeCache({
      tags: [`staticPage:${_id}`],
    })
  } else if (_type === "authorType") {
    await purgeCache({
      tags: [`authors, authors:${_id}`],
    })
  }

  return null
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie")
  const cookie = (await langPreferenceCookie.parse(cookieHeader)) || {}
  const langPreference = cookie.langPreference === "en" ? "fr" : "en"

  return redirect(`/${langPreference}`, { status: 404 })
}
