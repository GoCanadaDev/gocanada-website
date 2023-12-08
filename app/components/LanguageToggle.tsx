import { useTranslation } from "react-i18next"
import { SupportedLanguages } from "~/i18n"
import useSound from "use-sound"
import { MouseEventHandler } from "react"
import { animated } from "react-spring"
import clickSound from "../../public/sounds/click.mp3"
import useBoop from "~/lib/useBoop"
import { Globe2 } from "lucide-react"

export function LanguageToggle() {
  const [play] = useSound(clickSound)
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 10 })
  let { i18n } = useTranslation()

  const changeLanguage = (language: SupportedLanguages) => {
    i18n.changeLanguage(language)
  }

  const { language } = i18n

  return (
    <button
      onMouseEnter={trigger as MouseEventHandler<HTMLButtonElement>}
      type="button"
      onClick={() => {
        play()
        changeLanguage(language === "en" ? "fr" : "en")
      }}
    >
      <animated.div style={style} className="mr-2 inline-block">
        <Globe2 className="inline" />
      </animated.div>
      {language.toUpperCase()}
    </button>
  )
}
