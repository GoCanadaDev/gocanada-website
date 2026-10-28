import { langPreferenceCookie } from "~/cookies.server"
import type { SupportedLanguages } from "~/i18n"

export const setLanguageCookie = async (langPreference: SupportedLanguages) => {
  return {
    "Set-Cookie": await langPreferenceCookie.serialize({
      langPreference,
    }),
  }
}
