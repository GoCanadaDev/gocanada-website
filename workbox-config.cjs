module.exports = {
  globDirectory: "public/",
  globPatterns: [
    "**/*.{js,css,html,png,jpg,jpeg,svg,ico,json,woff2,woff,ttf,eot}",
  ],
  swDest: "public/sw.js",
  runtimeCaching: [
    {
      urlPattern: /\.(?:js|css|woff2|woff|ttf|eot)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/cdn\.sanity\.io\/images\//,
      handler: "CacheFirst",
      options: {
        cacheName: "sanity-images",
        expiration: {
          maxEntries: 1000,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/cdn\.sanity\.io\/data\/query\//,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "sanity-api",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
      },
    },
    {
      urlPattern: /\//,
      handler: "NetworkFirst",
      options: {
        cacheName: "html-pages",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
      },
    },
  ],
}
