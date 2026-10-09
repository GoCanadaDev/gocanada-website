// Algolia rejects records over 10KB on our plan. Leave some headroom.
const MAX_RECORD_BYTES = 9500

const stopWords = new Set([
  "the",
  "and",
  "a",
  "an",
  "is",
  "in",
  "it",
  "of",
  "on",
  "for",
  "to",
  "with",
  "by",
  "that",
  "this",
  "was",
  "were",
  "are",
  "be",
  "or",
  "as",
  "at",
  "but",
  "from",
  "which",
  "when",
  "where",
  "how",
  "why",
  "all",
  "any",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "so",
  "than",
  "too",
  "very",
  "can",
  "will",
  "just",
  "don't",
  "should",
  "now",
])

/**
 * Reduces text to a space-separated list of unique, lowercased words with
 * common stop words removed.
 */
export function extractKeywords(text: string) {
  const words = text.toLowerCase().match(/\b\w+\b/g)
  const uniqueKeywords = new Set<string>()

  words?.forEach((word) => {
    if (!stopWords.has(word)) {
      uniqueKeywords.add(word)
    }
  })

  return Array.from(uniqueKeywords).join(" ")
}

const byteLength = (value: unknown) =>
  new TextEncoder().encode(JSON.stringify(value)).length

/**
 * Converts a post's body to keywords and trims them so the whole record fits
 * under Algolia's record size limit.
 */
export function toAlgoliaPostRecord<T extends { body?: unknown }>(post: T) {
  const bodyText = Array.isArray(post.body)
    ? post.body.join(" ")
    : String(post.body ?? "")
  const keywords = extractKeywords(bodyText).split(" ")

  const record = { ...post, body: keywords.join(" ") }

  // Drop trailing keywords until the record fits.
  const overhead = byteLength({ ...post, body: "" })
  let bodyBytes = byteLength(record.body)
  while (keywords.length > 0 && overhead + bodyBytes > MAX_RECORD_BYTES) {
    bodyBytes -= new TextEncoder().encode(keywords.pop()!).length + 1
  }
  record.body = keywords.join(" ")

  return record
}
