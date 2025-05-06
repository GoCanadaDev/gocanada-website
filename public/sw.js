importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
)

const { registerRoute } = workbox.routing
const { CacheFirst, StaleWhileRevalidate, NetworkFirst } = workbox.strategies
const { ExpirationPlugin } = workbox.expiration
const { CacheableResponsePlugin } = workbox.cacheableResponse

// Cache static assets (JS, CSS, etc.) for 30 days
registerRoute(
  ({ request }) =>
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font",
  new CacheFirst({
    cacheName: "static-assets",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
)

// Cache Sanity images for 30 days
registerRoute(
  ({ url }) =>
    url.origin === "cdn.sanity.io" && url.pathname.includes("/images/"),
  new CacheFirst({
    cacheName: "sanity-images",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
)

// Cache HTML pages for 1 day with NetworkFirst strategy
registerRoute(
  ({ request }) => request.destination === "document",
  new NetworkFirst({
    cacheName: "html-pages",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
)

// Stale-While-Revalidate for Sanity API content
registerRoute(
  ({ url }) =>
    url.origin === "cdn.sanity.io" && url.pathname.includes("/data/query/"),
  new StaleWhileRevalidate({
    cacheName: "sanity-api",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 5 * 60, // 5 minutes for API content
      }),
    ],
  })
)

// Precache static assets
workbox.precaching.precacheAndRoute([
  { url: "/", revision: "1" },
  { url: "/favicon.ico", revision: "1" },
  // Add other static assets you want to precache
])
