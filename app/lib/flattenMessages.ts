import type en from "../../public/locales/en/common.json"

export interface INestedMessages {
  [key: string]: string | INestedMessages
}
export const flattenMessages = (
  nestedMessages?: INestedMessages,
  prefix = ""
): Record<string, string> => {
  if (!nestedMessages) return {}
  return Object.keys(nestedMessages).reduce(
    (messages: Record<string, string>, key) => {
      const value = nestedMessages[key]
      const prefixedKey = prefix ? `${prefix}.${key}` : key

      if (typeof value === "string") {
        messages[prefixedKey] = value
      } else if (value) {
        Object.assign(messages, flattenMessages(value, prefixedKey))
      }

      return messages
    },
    {}
  )
}

// Define a TypeScript type called KeyPaths that takes in an object type T as its generic type parameter.
// KeyPaths is defined as a mapped type, which produces a new type by iterating over the keys of T.
type KeyPaths<T> = {
  // For each string key K in T, check whether the value of that key T[K] is a nested object.
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? // If the value of the key is an object, build the dotted path to each of its keys.
      `${K}.${KeyPaths<T[K]>}`
    : // If the value of the key is not an object, simply return the key name K.
      K
  // Finally, index the mapped type by its keys, which returns a union of all the key paths in T.
}[keyof T & string]

export type TranslationKey = KeyPaths<typeof en>
