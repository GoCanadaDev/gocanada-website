import { Form } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import { SupportedLanguages } from "~/i18n"
import useSound from "use-sound"
import { MouseEventHandler, useEffect, useState } from "react"
import { animated } from "react-spring"
import clickSound from "../../public/sounds/click.mp3"
import useBoop from "~/lib/useBoop"
import { Globe2 } from "lucide-react"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

export function LanguageToggle({
  translationUrl,
}: {
  translationUrl?: string
}) {
  const [play] = useSound(clickSound)
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 10 })
  const {
    i18n: { changeLanguage, resolvedLanguage },
    ready,
    t,
  } = useTranslation()
  const [defaultValue, setDefaultValue] = useState(translationUrl)

  useEffect(() => {
    setDefaultValue(translationUrl)
  }, [translationUrl])

  const changeLanguageTo = async (language: SupportedLanguages) => {
    if (ready) {
      const message = t("languageChanged")
      toast.success(message)
    }
    changeLanguage(language)
  }

  const languageToChangeTo = resolvedLanguage === "en" ? "fr" : "en"

  return (
    <Form method="post" action="/resource/toggle-lang">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {ready && (
              <button
                onMouseEnter={trigger as MouseEventHandler<HTMLButtonElement>}
                type="submit"
                aria-label={t("currentLanguage")}
                className="rounded-md p-2 focus:bg-zinc-100 focus:outline-none dark:focus:bg-zinc-800"
                onClick={() => {
                  play()
                  changeLanguageTo(languageToChangeTo)
                }}
              >
                <input
                  name="translationUrl"
                  defaultValue={defaultValue}
                  hidden
                />
                <animated.div style={style}>
                  <Globe2 className="inline" />
                </animated.div>
              </button>
            )}
          </TooltipTrigger>
          <TooltipContent>{t("currentLanguage")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Form>
  )
}
