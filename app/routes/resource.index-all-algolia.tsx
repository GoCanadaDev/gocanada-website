import algoliasearch from "algoliasearch"
import { client } from "~/sanity/client"
import { json } from "@remix-run/node"

import type { ActionFunction } from "@remix-run/node"

import {
  algoliaApplicationId,
  algoliaAdminApiKey,
} from "~/sanity/projectDetails"
import { getAlgoliaPosts } from "~/sanity/queries"

const algoliaAdminInstance = algoliasearch(
  algoliaApplicationId,
  algoliaAdminApiKey
)

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
  /*  const sanityAlgolia = indexer(
    {
      post: {
        index: algolia.initIndex("posts"),
      },
    },
    (document) => {
      switch (document._type) {
        case "post":
          return {
            title: document.title,
            path: document.slug.current,
            publishedAt: document.publishedAt,
            excerpt: flattenBlocks(document.excerpt),
          }
        default:
          throw new Error(`Unknown type: ${document.type}`)
      }
    }
  )

  const body = await request.json()

  await sanityAlgolia.webhookSync(client, body)
  console.log("body --- ", body)
  */
}
