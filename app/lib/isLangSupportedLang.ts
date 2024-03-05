import invariant from "tiny-invariant"
import { SUPPORTED_LANGUAGES, SupportedLanguages } from "~/i18n"

const isLangSupportedLang = (lang: string | undefined) => {
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

export default isLangSupportedLang
