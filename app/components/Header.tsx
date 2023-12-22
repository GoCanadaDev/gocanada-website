import { Logo } from "~/components/Logo"
import { ThemeToggle } from "~/components/ThemeToggle"
import { LanguageToggle } from "~/components/LanguageToggle"
import { Instagram } from "lucide-react"
import useBoop from "~/lib/useBoop"
import { animated } from "react-spring"
import { MouseEventHandler } from "react"

export function Header({ translationUrl }: { translationUrl: string }) {
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 5 })

  return (
    <header className="border-b-4 border-slate-100 transition-colors duration-1000 ease-in-out dark:border-slate-800">
      <div className="container mx-auto flex items-center justify-between p-4 lg:px-12">
        <Logo />
        <div className="flex items-center gap-8">
          <a
            onMouseEnter={trigger as MouseEventHandler<HTMLAnchorElement>}
            href="https://instagram.com/canada"
            className="border-r pr-4 transition-colors duration-200 hover:text-red-700"
          >
            <animated.span style={style} className="mr-2 inline-block">
              <Instagram className="inline" />
            </animated.span>
            @canada
          </a>
          <LanguageToggle translationUrl={translationUrl} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
