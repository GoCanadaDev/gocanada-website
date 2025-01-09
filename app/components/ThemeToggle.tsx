import { Form } from "react-router"
import { Moon, Sun } from "lucide-react"
import useSound from "use-sound"
import onSound from "../sounds/switch-on.mp3"
import offSound from "../sounds/switch-off.mp3"
import useBoop from "~/lib/useBoop"
import { animated } from "react-spring"
import { useRootLoaderData } from "~/lib/useRootLoaderData"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

export function ThemeToggle() {
  const [switchOn] = useSound(onSound)
  const [switchOff] = useSound(offSound)
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 10 })

  const { themePreference } = useRootLoaderData()

  const isDarkMode = themePreference === "dark"

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
              onMouseEnter={trigger}
              type="submit"
              aria-label={"Toggle theme"}
              onClick={() => {
                isDarkMode ? switchOn() : switchOff()
              }}
              className="rounded-md p-1 focus:bg-zinc-100 focus:outline-none dark:focus:bg-zinc-800 md:first-letter:p-2"
            >
              {isDarkMode ? <Sun /> : <Moon />}
            </animated.button>
          </TooltipTrigger>
          <TooltipContent>Toggle theme</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Form>
  )
}
