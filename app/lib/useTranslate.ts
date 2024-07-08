import { useTranslation } from "react-i18next"
import { useCallback } from "react"
import { type TranslationKey } from "./flattenMessages"

/**
 * Wrapper around useTranslation so we can use our TranslationKey type for typescript autocompletion
 * @returns {translate} A function that takes in a key of type TranslationKey and returns a string
 */
export const useTranslate = () => {
  const { t, ready } = useTranslation()
  const translate = useCallback((key: TranslationKey) => t(key), [t])

  return { translate, ready }
}
