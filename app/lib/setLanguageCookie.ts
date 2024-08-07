import { SupportedLanguages } from "~/i18n"
import { langPreferenceCookie } from "~/cookies.server"

const setLanguageCookie = async (langPreference: SupportedLanguages) => {
  return {
    "Set-Cookie": await langPreferenceCookie.serialize({
      langPreference,
    }),
  }
}

export default setLanguageCookie
