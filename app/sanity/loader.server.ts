import { client } from "~/sanity/client"
import { queryStore } from "~/sanity/loader"

export const { loadQuery } = queryStore

// Default setup with regular client
queryStore.setServerClient(client)

// Create a draft-aware function
export function loadQueryWithDraft(
  query: string,
  params: any,
  isDraftMode: boolean
) {
  // Modify params to include draft status if needed
  const enhancedParams = { ...params, includeDrafts: isDraftMode }

  // Use the token-enabled client when in draft mode
  const clientToUse = isDraftMode
    ? client.withConfig({
        token: process.env.SANITY_READ_TOKEN,
        perspective: "drafts",
      })
    : client

  queryStore.setServerClient(clientToUse)
  return loadQuery(query, enhancedParams)
}
