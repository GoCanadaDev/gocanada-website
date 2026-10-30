function isBlank(value: unknown) {
  return value == null || (typeof value === "string" && value.trim() === "")
}

/**
 * Fills in missing French values with the English ones, so French pages render
 * while translations are on hold. Sanity omits null fields, so a localized
 * value may have no `fr` key at all.
 */
export function withEnglishFallback<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(withEnglishFallback) as T
  }

  if (value === null || typeof value !== "object") {
    return value
  }

  const result: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(value)) {
    result[key] = withEnglishFallback(child)
  }

  if ("en" in result && isBlank(result.fr)) {
    result.fr = result.en
  }

  return result as T
}
