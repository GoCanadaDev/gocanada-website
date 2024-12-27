import algoliasearch from "algoliasearch"
import { client } from "~/sanity/client"
import indexer from "sanity-algolia"

import type { ActionFunction } from "react-router"

import {
  algoliaAdminApiKey,
  algoliaApplicationId,
} from "~/sanity/projectDetails"
import { algoliaPostsProjection } from "~/sanity/queries"
import { sanitizeStrings } from "~/lib/sanitizeStrings"

const algoliaAdminInstance = algoliasearch(
  algoliaApplicationId,
  algoliaAdminApiKey
)

export interface WebhookBody {
  ids: {
    created: string[]
    updated: string[]
    deleted: string[]
  }
}

export const action: ActionFunction = async ({ request }) => {
  const index = algoliaAdminInstance.initIndex("posts")
  const json = await request.json()
  const sanityAlgolia = indexer(
    {
      postType: {
        index,
        projection: algoliaPostsProjection,
      },
    },
    (document) => sanitizeStrings(document),
    // Visibility function to determine which document should be included
    (document) => !["unapproved"].includes(document.status)
  )

  // Now let sanityAlgolia do the heavy lifting
  return sanityAlgolia
    .webhookSync(client, json as unknown as WebhookBody)
    .then(() => ({
      status: 200,
      body: "Success!",
    }))
    .catch((error) => ({
      status: 500,
      body: "Something went wrong",
    }))
}
