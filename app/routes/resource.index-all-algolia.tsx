import { client } from "~/sanity/client"
import { json } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"

import { getAlgoliaPosts } from "~/sanity/queries"
import { algoliaAdminInstance } from "~/algolia"

export const action: ActionFunction = async ({ request }) => {
  const posts = await getAlgoliaPosts(client)
  const index = algoliaAdminInstance.initIndex("posts")

  try {
    console.time(`Saving ${posts.length} posts to index:`)
    await index.saveObjects(posts)
    console.timeEnd(`Saving ${posts.length} posts to index:`)

    return json(
      { success: true },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    )
  } catch (error) {
    console.error(error)

    return json(
      { success: false },
      {
        status: 200,
      }
    )
  }
}
