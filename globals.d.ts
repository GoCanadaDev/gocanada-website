export {}
declare global {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test"
    SANITY_STUDIO_PROJECT_ID: string
    SANITY_STUDIO_PROJECT_ID: string
    SANITY_STUDIO_DATASET: string
    SANITY_STUDIO_API_VERSION: string
    SANITY_STUDIO_URL: string
    SANITY_STUDIO_USE_STEGA: string
    ALGOLIA_APPLICATION_ID: string
    ALGOLIA_SEARCH_API_KEY: string
    ALGOLIA_ADMIN_API_KEY: string
    FACEBOOK_PIXEL_ID: string
    GTAG_ID: string
    SANITY_WRITE_TOKEN: string
    SANITY_READ_TOKEN: string
    SANITY_SESSION_SECRET: string
    NONCE: string
  }
  interface Process {
    env: ProcessEnv
  }
  let process: Process

  interface Window {
    fbq: any
    gtag: any
  }
}
