import { createCookieSessionStorage } from "@remix-run/node"

export const DRAFT_SESSION_NAME = "__draft"

if (!process.env.SANITY_SESSION_SECRET) {
  throw new Error(`Missing SANITY_SESSION_SECRET in .env`)
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: DRAFT_SESSION_NAME,
      secrets: [process.env.SANITY_SESSION_SECRET],
      sameSite: "lax",
    },
  })

export { commitSession, destroySession, getSession }
