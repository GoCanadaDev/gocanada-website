const {
  SANITY_STUDIO_PROJECT_ID,
  SANITY_STUDIO_DATASET,
  SANITY_STUDIO_API_VERSION,
  SANITY_STUDIO_URL,
  SANITY_STUDIO_USE_STEGA = false,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_SEARCH_API_KEY,
  ALGOLIA_ADMIN_API_KEY,
} = typeof document === "undefined" ? process.env : window.ENV || {}

export const projectId = SANITY_STUDIO_PROJECT_ID!
export const dataset = SANITY_STUDIO_DATASET!
export const apiVersion = SANITY_STUDIO_API_VERSION!
export const studioUrl = SANITY_STUDIO_URL!
export const useStega = SANITY_STUDIO_USE_STEGA === "true"
export const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/`

export const algoliaApplicationId = ALGOLIA_APPLICATION_ID!

export const algoliaSearchApiKey = ALGOLIA_SEARCH_API_KEY!

export const algoliaAdminApiKey = ALGOLIA_ADMIN_API_KEY!

// if (!projectId) throw new Error("Missing SANITY_STUDIO_PROJECT_ID in .env")
// if (!dataset) throw new Error("Missing SANITY_STUDIO_DATASET in .env")
// if (!apiVersion) throw new Error("Missing SANITY_STUDIO_API_VERSION in .env")
// if (!studioUrl) throw new Error("Missing SANITY_STUDIO_URL in .env")
// if (typeof useStega !== "boolean")
//   throw new Error(
//     `SANITY_STUDIO_USE_STEGA must be a boolean, current value: ${useStega}`
//   )
// if (!algoliaApplicationId) throw new Error("Missing ALGOLIA_APPLICATION_ID")
// if (!algoliaSearchApiKey) throw new Error("Missing ALGOLIA_SEARCH_API_KEY")
