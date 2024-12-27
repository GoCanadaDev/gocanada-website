import * as queryStore from "@sanity/react-loader"

import { client } from "~/sanity/client"

const clientWithToken = client.withConfig({
  // Token required for when perspective: 'previewDrafts'
  token: process.env.SANITY_READ_TOKEN,
  // Minimum required stega config
  stega: { studioUrl: "/studio" },
})

queryStore.setServerClient(clientWithToken)

export const { loadQuery } = queryStore
