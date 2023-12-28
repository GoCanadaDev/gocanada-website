import { useFetcher } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { SupportedLanguages } from "~/i18n"
import useSound from "use-sound"
import { MouseEventHandler } from "react"
import { animated } from "react-spring"
import clickSound from "../../public/sounds/click.mp3"
import useBoop from "~/lib/useBoop"
import { Globe2 } from "lucide-react"
import { toast } from "sonner"

export function LanguageToggle({
  translationUrl,
}: {
  translationUrl?: string
}) {
  const [play] = useSound(clickSound)
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 10 })
  let {
    i18n: { changeLanguage, language },
    t,
    ready,
  } = useTranslation()
  const cookieToggle = useFetcher()

  const changeLanguageTo = async (language: SupportedLanguages) => {
    if (ready) {
      const message = t("languageChanged")
      console.log(message)
      toast.info(message)
    }
    changeLanguage(language)
  }

  const languageToChangeTo = language === "en" ? "fr" : "en"

  return (
    <cookieToggle.Form method="post" action="/resource/toggle-lang">
      <button
        onMouseEnter={trigger as MouseEventHandler<HTMLButtonElement>}
        type="submit"
        onClick={() => {
          play()
          changeLanguageTo(languageToChangeTo)
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
