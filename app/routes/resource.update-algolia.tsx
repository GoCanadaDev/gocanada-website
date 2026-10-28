import type { ActionFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import groq from "groq"

import { algoliaAdminInstance } from "~/algolia"
import { toAlgoliaPostRecord } from "~/algolia/records"
import { sanitizeStrings } from "~/lib/sanitizeStrings"
import { client } from "~/sanity/client"
import { algoliaPostsProjection } from "~/sanity/queries"

export interface WebhookBody {
  ids: {
    created: string[]
    updated: string[]
    deleted: string[]
  }
}

const changedPostsQuery = groq`*[_type == "postType" && (_id in $created || _id in $updated)]{
  _id,
  _type,
  _rev,
  _type == "postType" => ${algoliaPostsProjection}
}`

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function webhookSync({ ids }: WebhookBody) {
  // Give the Sanity query engine a moment to catch up to the mutations
  await sleep(2000)

  const index = algoliaAdminInstance.initIndex("posts")
  const { created = [], updated = [], deleted = [] } = ids
  const posts = await client.fetch<Record<string, any>[]>(changedPostsQuery, {
    created,
    updated,
  })

  const records = posts.map((post) => ({
    objectID: post._id,
    type: post._type,
    rev: post._rev,
    ...toAlgoliaPostRecord(sanitizeStrings(post)),
  }))
  if (records.length > 0) {
    await index.saveObjects(records)
  }

  // Created/updated ids the query didn't return (unpublished, or not a post)
  // may have been indexed before, so remove them along with deleted ones.
  const savedIds = new Set(posts.map((post) => post._id))
  const idsToDelete = deleted.concat(
    created.concat(updated).filter((id) => !savedIds.has(id))
  )
  if (idsToDelete.length > 0) {
    await index.deleteObjects(idsToDelete)
  }
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.json()

  try {
    await webhookSync(body as WebhookBody)

    return json({ success: true }, { status: 200 })
  } catch (error) {
    console.error(error)

    return json({ success: false }, { status: 500 })
  }
}
