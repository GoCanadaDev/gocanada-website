import invariant from "tiny-invariant"

import type { SupportedLanguages } from "~/i18n"
import { SUPPORTED_LANGUAGES } from "~/i18n"

export const isLangSupportedLang = (lang: string | undefined) => {
  invariant(lang, "Expected lang param")

  const isSupported = Object.values(SUPPORTED_LANGUAGES).includes(
    lang as SupportedLanguages
  )

  invariant(
    isSupported,
    `Expected lang to be one of ${SUPPORTED_LANGUAGES.join(", ")}`
  )

  return isSupported
}
