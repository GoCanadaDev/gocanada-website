import { createCookie } from "@remix-run/node"

export const themePreferenceCookie = createCookie(`themePreference`, {
  path: "/",
})

export const langPreferenceCookie = createCookie(`langPreference`, {
  path: "/",
})
