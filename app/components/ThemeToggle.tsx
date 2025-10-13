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

export function ThemeToggle() {
  const [switchOn] = useSound(onSound)
  const [switchOff] = useSound(offSound)
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 10 })

  const rootLoaderData = useRootLoaderData()
  const themePreference = rootLoaderData?.themePreference

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
              onMouseEnter={trigger as MouseEventHandler<HTMLButtonElement>}
              type="submit"
              aria-label={"Toggle theme"}
              onClick={() => {
                isDarkMode ? switchOn() : switchOff()
              }}
              className="rounded-md p-1 focus:bg-zinc-100 focus:outline-none md:first-letter:p-2 dark:focus:bg-zinc-800"
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
