import { Namespace, TFunction } from "i18next"

export const useTranslations = async (t: TFunction<Namespace, undefined>) => {
  // for each key in the translation file, we can call t(key) to get the translation
  // and then save it to a variable to use in our components for SSR and client-side rendering
  const about = t("about")
  const advertising = t("advertising")
  const contact = t("contact")
  const currentLanguage = t("currentLanguage")
  const greeting = t("greeting")
  const languageChanged = t("languageChanged")
  const media = t("media")
  const postsTagged = t("postsTagged")
  const privacyPolicy = t("privacyPolicy")
  const readMore = t("readMore")
  const search = t("search")
  const terms = t("terms")
  const toggleTheme = t("toggleTheme")
  const viewAll = t("viewAll", { lng: "en" })

  return {
    about,
    advertising,
    contact,
    currentLanguage,
    greeting,
    languageChanged,
    media,
    postsTagged,
    privacyPolicy,
    readMore,
    search,
    terms,
    toggleTheme,
    viewAll,
  }
}
