export const projectId = global.ENV.SANITY_STUDIO_PROJECT_ID
export const dataset = global.ENV.SANITY_STUDIO_DATASET
export const apiVersion = global.ENV.SANITY_STUDIO_API_VERSION
export const studioUrl = global.ENV.SANITY_STUDIO_URL
export const useStega = Boolean(global.ENV.SANITY_STUDIO_USE_STEGA === "true")

if (!projectId) throw new Error("Missing SANITY_STUDIO_PROJECT_ID in .env")
if (!dataset) throw new Error("Missing SANITY_STUDIO_DATASET in .env")
if (!apiVersion) throw new Error("Missing SANITY_STUDIO_API_VERSION in .env")
if (!studioUrl) throw new Error("Missing SANITY_STUDIO_URL in .env")
if (typeof useStega !== "boolean")
  throw new Error(
    `SANITY_STUDIO_USE_STEGA must be a boolean, current value: ${useStega}`
  )
