export default function addExternalScripts(ENV: Window["ENV"]) {
  if (
    (!ENV.GTAG_ID && !ENV.FACEBOOK_PIXEL_ID) ||
    process.env.NODE_ENV === "development"
  ) {
    return
  }

  // Check if window is defined to ensure it's running on the client
  if (typeof window !== "undefined") {
    // Add the Facebook Pixel script dynamically
    ;(function (f, b, e, v, n, t, s) {
      if (f.fbq) return
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments)
      }
      if (!f._fbq) f._fbq = n
      n.push = n
      n.loaded = !0
      n.version = "2.0"
      n.queue = []
      t = b.createElement(e)
      t.async = !0
      t.src = v
      s = b.getElementsByTagName(e)[0]
      s.parentNode.insertBefore(t, s)
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js"
    )

    // Initialize the Facebook Pixel with your ID
    window.fbq("init", ENV.FACEBOOK_PIXEL_ID)
    window.fbq("track", "PageView")

    // Code copied from GTM console + added type annotations.
    ;(function (w: Window, d: Document, s: "script", l: string, i: string) {
      w[l] = w[l] || []
      w[l].push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      })
      const f = d.getElementsByTagName(s)[0]
      const j = d.createElement<"script">(s)
      const dl = l != "dataLayer" ? "&l=" + l : ""
      j.async = true
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl
      f.parentNode?.insertBefore(j, f)
    })(window, document, "script", "dataLayer", ENV.GTAG_ID)
  }
}