import { useFetcher } from "@remix-run/react"
import { Moon, Sun } from "lucide-react"
import useSound from "use-sound"
import onSound from "../../public/sounds/switch-on.mp3"
import offSound from "../../public/sounds/switch-off.mp3"
import useBoop from "~/lib/useBoop"
import { animated } from "react-spring"
import { MouseEventHandler } from "react"
import { useRootLoaderData } from "~/lib/useRootLoaderData"

export function ThemeToggle() {
  const [switchOn] = useSound(onSound)
  const [switchOff] = useSound(offSound)
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 10 })

  const cookieToggle = useFetcher()
  const { themePreference } = useRootLoaderData()

  const isDarkMode = themePreference === `dark`

  return (
    <cookieToggle.Form
      method="post"
      action="/resource/toggle-theme"
      className="flex items-center justify-center"
    >
      <animated.button
        style={style}
        onMouseEnter={trigger as MouseEventHandler<HTMLButtonElement>}
        aria-label={`Activate ${isDarkMode ? "light" : "dark"} mode`}
        title={`Activate ${isDarkMode ? "light" : "dark"} mode`}
        type="submit"
        disabled={cookieToggle.state === "submitting"}
        onClick={() => {
          isDarkMode ? switchOn() : switchOff()
        }}
      >
        {isDarkMode ? <Sun /> : <Moon />}
        <div className="sr-only select-none">
          {isDarkMode ? `Light` : `Dark`} Mode
        </div>
      </animated.button>
    </cookieToggle.Form>
  )
}
