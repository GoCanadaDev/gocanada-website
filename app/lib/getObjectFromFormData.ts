/**
 * Given a `FormData` object, return an object with the same keys and values (as strings)
 * @param formData A Remix `FormData` object to parse
 * @returns An object representation of the `FormData` in the given type with all values as strings
 */
export default function getObjectFromFormData<T>(formData: FormData): T {
  const obj: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    obj[key] = typeof value === "object" ? value : value.toString()
  }
  return obj as unknown as T
}
