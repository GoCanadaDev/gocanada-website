import { zeroWidthTrim } from "./zeroWidthTrim"

// We were getting some weird zero width characters in the responses from groq queries,
// so this is a quick fix to remove them. The characters don't show up in Sanity Studio Vision

/**
 * Recursively trims all strings in an object. Note that if you pass in an array, you need to do
 * `Object.values(myArray(sanitizeStrings))` to get an array back
 * @param obj The object with nested things to sanitize.
 * @returns The object with all strings cleaned up of zero width characters.
 */
export function sanitizeStrings(obj: any) {
  const trimmedObj: Record<string, any> = {}

  for (let key in obj) {
    if (typeof obj[key] === "string") {
      trimmedObj[key] = zeroWidthTrim(obj[key])
    } else if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      // If the value is an object (but not an array), recursively call trimStrings
      trimmedObj[key] = sanitizeStrings(obj[key])
    } else if (Array.isArray(obj[key])) {
      // check if its an array of strings, and if so, just trim the strings
      if (typeof obj[key][0] === "string") {
        trimmedObj[key] = obj[key].map((item: string) => zeroWidthTrim(item))
      } else {
        // If the value is an array, iterate over its elements and recursively call trimStrings
        trimmedObj[key] = obj[key].map((item: any) => sanitizeStrings(item))
      }
    } else {
      // If the value is neither string nor object nor array, copy it as is
      trimmedObj[key] = obj[key]
    }
  }

  return trimmedObj
}
