import { useRootLoaderData } from "./useRootLoaderData"

/**
 * Wrapper around useTranslation so we can use our TranslationKey type for typescript autocompletion
 * @returns {translate} A function that takes in a key of type TranslationKey and returns a string
 */
export const useTranslate = () => {
  const { translations } = useRootLoaderData()

  return { translations }
}
