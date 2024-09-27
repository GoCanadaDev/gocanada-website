import { createCookie } from "@remix-run/node"

export const themePreferenceCookie = createCookie(`themePreference`, {
  path: "/",
})

export const langPreferenceCookie = createCookie(`langPreference`, {
  path: "/",
})

export const gdprConsent = createCookie("gdpr-consent", {
  path: "/",
  maxAge: 31536000, // One Year
})

export const hasSeenWelcomeDialog = createCookie("has-seen-welcome-dialog", {
  path: "/",
  maxAge: 31536000, // One Year
})
