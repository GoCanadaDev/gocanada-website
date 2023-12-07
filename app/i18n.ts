export const SUPPORTED_LANGUAGES = ["en", "fr"] as const
export type SupportedLanguages = (typeof SUPPORTED_LANGUAGES)[number]

// only for use below since SUPPORTED_LANGUAGES is readonly
const supportedLngs = [...SUPPORTED_LANGUAGES]

export default {
  // This is the list of languages your application supports
  supportedLngs: supportedLngs,
  // This is the language you want to use in case
  // if the user language is not in the supportedLngs
  fallbackLng: "en",
  // The default namespace of i18next is "translation", but you can customize it here
  defaultNS: "common",
  // Disabling suspense is recommended
  react: { useSuspense: false },
}
