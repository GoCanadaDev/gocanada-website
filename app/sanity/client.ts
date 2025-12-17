import { createClient } from "@sanity/client"

import {
  apiVersion,
  dataset,
  projectId,
  studioUrl,
  useStega,
} from "./projectDetails"

// Only create the client if we have the required values
// This prevents errors when window.ENV is not yet available (e.g., in error boundaries)
// On the server, process.env should always have these values
// On the client, window.ENV might not be set during error boundary rendering
const hasRequiredValues = projectId && dataset && apiVersion

export const client = hasRequiredValues
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      stega: {
        enabled: useStega,
        studioUrl,
      },
    })
  : // Create a minimal client with placeholder values to satisfy type requirements
    // This won't be used on the client side anyway (client is only used in server loaders)
    createClient({
      projectId: projectId || "placeholder",
      dataset: dataset || "placeholder",
      apiVersion: apiVersion || "2024-01-01",
      useCdn: true,
    })
