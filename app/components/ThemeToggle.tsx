import { useFetcher, useLoaderData } from "@remix-run/react"
import { Moon, Sun } from "lucide-react"
import useSound from "use-sound"
import type { RootLoaderData } from "~/root"
import clickSound from "../../public/sounds/click.mp3"
import useBoop from "~/lib/useBoop"
import { animated } from "react-spring"
import { MouseEventHandler } from "react"

export function ThemeToggle() {
  const [play] = useSound(clickSound)
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 10 })

  const cookieToggle = useFetcher()
  const { themePreference } = useLoaderData() as RootLoaderData

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
        onClick={() => play()}
      >
        {isDarkMode ? <Sun /> : <Moon />}
        <div className="sr-only select-none">
          {isDarkMode ? `Light` : `Dark`} Mode
        </div>
      </animated.button>
    </cookieToggle.Form>
  )
}
