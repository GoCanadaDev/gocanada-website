import { useFetcher } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { SupportedLanguages } from "~/i18n"
import useSound from "use-sound"
import { MouseEventHandler } from "react"
import { animated } from "react-spring"
import clickSound from "../../public/sounds/click.mp3"
import useBoop from "~/lib/useBoop"
import { Globe2 } from "lucide-react"

export function LanguageToggle({ translationUrl }: { translationUrl: string }) {
  const [play] = useSound(clickSound)
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 10 })
  let { i18n } = useTranslation()
  const cookieToggle = useFetcher()

  const changeLanguage = async (language: SupportedLanguages) =>
    i18n.changeLanguage(language)

  const { language } = i18n
  const languageToChangeTo = language === "en" ? "fr" : "en"

  return (
    <cookieToggle.Form method="post" action="/resource/toggle-lang">
      <button
        onMouseEnter={trigger as MouseEventHandler<HTMLButtonElement>}
        type="submit"
        onClick={() => {
          play()
          changeLanguage(languageToChangeTo)
        }}
      >
        <input name="translationUrl" defaultValue={translationUrl} hidden />
        <animated.div style={style} className="mr-2 inline-block">
          <Globe2 className="inline" />
        </animated.div>
        <span>
          <span className="sr-only select-none">
            {language === "en" ? "Français" : "English"}
          </span>
          {languageToChangeTo.toUpperCase()}
        </span>
      </button>
    </cookieToggle.Form>
  )
}
