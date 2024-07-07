import { Form } from "@remix-run/react"
import { Moon, Sun } from "lucide-react"
import useSound from "use-sound"
import onSound from "../../public/sounds/switch-on.mp3"
import offSound from "../../public/sounds/switch-off.mp3"
import useBoop from "~/lib/useBoop"
import { animated } from "react-spring"
import { MouseEventHandler } from "react"
import { useRootLoaderData } from "~/lib/useRootLoaderData"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { useTranslate } from "~/lib/useTranslate"
import { useHasMounted } from "~/lib/useHasMounted"

export function ThemeToggle() {
  const [switchOn] = useSound(onSound)
  const [switchOff] = useSound(offSound)
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 10 })
  const hasMounted = useHasMounted()

  const { themePreference } = useRootLoaderData()
  const { translate } = useTranslate()

  const isDarkMode = themePreference === "dark"

  if (!hasMounted) {
    return null
  }

  return (
    <Form
      method="post"
      action="/resource/toggle-theme"
      className="flex items-center justify-center"
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <animated.button
              style={style}
              onMouseEnter={trigger as MouseEventHandler<HTMLButtonElement>}
              type="submit"
              aria-label={translate("toggleTheme")}
              onClick={() => {
                isDarkMode ? switchOn() : switchOff()
              }}
              className="rounded-md p-2 focus:bg-slate-100 focus:outline-none dark:focus:bg-slate-800"
            >
              {isDarkMode ? <Sun /> : <Moon />}
            </animated.button>
          </TooltipTrigger>
          <TooltipContent>{translate("toggleTheme")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Form>
  )
}
