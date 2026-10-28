import type { Author } from "~/sanity/queries"

// Social fields usually store handles, but some authors have full URLs saved instead
const authorProfileUrlBuilders = {
  website: (value: string) => value,
  instagram: (handle: string) => `https://instagram.com/${handle}`,
  threads: (handle: string) => `https://threads.net/${handle}`,
  twitter: (handle: string) => `https://twitter.com/${handle}`,
  youtube: (handle: string) => `https://youtube.com/${handle}`,
  facebook: (handle: string) => `https://facebook.com/${handle}`,
} as const

export type AuthorProfileKey = keyof typeof authorProfileUrlBuilders

export function getAuthorProfileUrl(
  key: AuthorProfileKey,
  value: unknown
): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined
  const trimmed = value.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return authorProfileUrlBuilders[key](trimmed)
}

export function getAuthorProfileUrls(
  author: Pick<Author, AuthorProfileKey>
): string[] {
  return (Object.keys(authorProfileUrlBuilders) as AuthorProfileKey[]).flatMap(
    (key) => getAuthorProfileUrl(key, author[key]) ?? []
  )
}
