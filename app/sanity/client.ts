import { createClient } from "@sanity/client"
import { apiVersion, dataset, projectId, studioUrl } from "./projectDetails"

export const client = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: apiVersion, // "2024-12-01",
  useCdn: true,
  stega: {
    studioUrl: studioUrl,
  },
})

// import { createClient } from "@sanity/client/stega"

// export const client = createClient({
//   projectId,
//   dataset,
//   apiVersion,
//   useCdn: true,
//   stega: {
//     enabled: useStega,
//     studioUrl,
//   },
// })
