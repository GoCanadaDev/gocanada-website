import invariant from "tiny-invariant"

/**
 * Type-safe way to add environment variables you want to expose to server and client.
 * 🚨 Note: do not expose anything sensitive here as it will be exposed to the client. 🚨
 * @returns ReturnType<typeof getEnv>
 */
export function getEnv() {
  invariant(
    process.env.SANITY_STUDIO_PROJECT_ID,
    "SANITY_STUDIO_PROJECT_ID should be defined"
  )
  invariant(
    process.env.SANITY_STUDIO_DATASET,
    "SANITY_STUDIO_DATASET should be defined"
  )
  invariant(
    process.env.SANITY_STUDIO_API_VERSION,
    "SANITY_STUDIO_API_VERSION should be defined"
  )
  invariant(
    process.env.SANITY_STUDIO_URL,
    "SANITY_STUDIO_URL should be defined"
  )
  invariant(
    process.env.SANITY_STUDIO_USE_STEGA,
    "SANITY_STUDIO_USE_STEGA should be defined"
  )

  invariant(
    process.env.ALGOLIA_APPLICATION_ID,
    "ALGOLIA_APPLICATION_ID should be defined"
  )

  invariant(
    process.env.ALGOLIA_SEARCH_API_KEY,
    "ALGOLIA_SEARCH_API_KEY should be defined"
  )

  invariant(
    process.env.FACEBOOK_PIXEL_ID,
    "FACEBOOK_PIXEL_ID should be defined"
  )

  return {
    SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
    SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
    SANITY_STUDIO_API_VERSION: process.env.SANITY_STUDIO_API_VERSION,
    SANITY_STUDIO_URL: process.env.SANITY_STUDIO_URL,
    SANITY_STUDIO_USE_STEGA: process.env.SANITY_STUDIO_USE_STEGA,
    ALGOLIA_APPLICATION_ID: process.env.ALGOLIA_APPLICATION_ID,
    ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
    ALGOLIA_ADMIN_API_KEY: "",
    FACEBOOK_PIXEL_ID: process.env.FACEBOOK_PIXEL_ID,
  }
}

type ENV = ReturnType<typeof getEnv>

declare global {
  var ENV: ENV
  interface Window {
    ENV: ENV
  }
}
