import { useFetcher } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { SupportedLanguages } from "~/i18n"
import useSound from "use-sound"
import { MouseEventHandler } from "react"
import { animated } from "react-spring"
import clickSound from "../../public/sounds/click.mp3"
import useBoop from "~/lib/useBoop"
import { Globe2 } from "lucide-react"
import { useRootLoaderData } from "~/lib/useRootLoaderData"

export function LanguageToggle({
  translationUrl,
}: {
  translationUrl?: string
}) {
  const [play] = useSound(clickSound)
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 10 })
  let { i18n } = useTranslation()
  const cookieToggle = useFetcher()
  const { langPreference } = useRootLoaderData()

  const changeLanguage = (language: SupportedLanguages) => {
    i18n.changeLanguage(language)
  }

  const { language } = i18n

  const currentLang = langPreference ?? language

  return (
    <cookieToggle.Form method="post" action="/resource/toggle-lang">
      <button
        onMouseEnter={trigger as MouseEventHandler<HTMLButtonElement>}
        type="submit"
        onClick={() => {
          play()
          changeLanguage(currentLang === "en" ? "fr" : "en")
        }}
      >
        <input name="translationUrl" defaultValue={translationUrl} hidden />
        <animated.div style={style} className="mr-2 inline-block">
          <Globe2 className="inline" />
        </animated.div>
        {currentLang.toUpperCase()}
      </button>
    </cookieToggle.Form>
  )
}
