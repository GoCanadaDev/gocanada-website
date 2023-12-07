import { useTranslation } from "react-i18next"
import { SupportedLanguages } from "~/i18n"

export function LanguageToggle() {
  let { i18n } = useTranslation()

  const changeLanguage = (language: SupportedLanguages) => {
    i18n.changeLanguage(language)
  }

  return (
    <div>
      <button type="button" onClick={() => changeLanguage("en")}>
        EN
      </button>
      {" / "}
      <button type="button" onClick={() => changeLanguage("fr")}>
        FR
      </button>
    </div>
  )
}
