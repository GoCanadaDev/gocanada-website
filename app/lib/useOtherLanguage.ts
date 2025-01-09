import { useParams } from "react-router";

/**
 * Hook for grabbing the other language from the url for use in linking to the other language
 * Note that this is short-sighted as it will only work for two languages, and if more langauges
 * are added, this will need to be updated
 * @returns "en" | "fr"
 */
export const useOtherLanguage = () => {
  const { lang } = useParams()
  const otherLanguage = lang === "en" ? "fr" : "en"

  return otherLanguage
}
