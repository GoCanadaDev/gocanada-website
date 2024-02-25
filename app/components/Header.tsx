import { Logo } from "~/components/Logo"
import { ThemeToggle } from "~/components/ThemeToggle"
import { LanguageToggle } from "~/components/LanguageToggle"
import { Instagram } from "lucide-react"
import useBoop from "~/lib/useBoop"
import { animated } from "react-spring"
import { MouseEventHandler } from "react"
import { Separator } from "~/components/ui/separator"
import SearchModal from "~/components/SearchModal"
import { Navigation } from "./Navigation"

export function Header({ translationUrl }: { translationUrl?: string }) {
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 5 })

  return (
    <header className="">
      <div className=" border-b-4 border-slate-100 transition-colors duration-1000 ease-in-out dark:border-slate-800">
        <div className="container mx-auto flex items-center justify-between p-4 lg:px-12">
          <Logo />
          <div className="flex items-center gap-4">
            <a
              onMouseEnter={trigger as MouseEventHandler<HTMLAnchorElement>}
              href="https://instagram.com/canada"
              className="transition-colors duration-200 hover:text-red-500"
            >
              <animated.span style={style} className="inline-block">
                <Instagram className="inline" />
              </animated.span>
              <span className="pl-2">@canada</span>
            </a>
            <Separator orientation="vertical" className="h-6" />
            <LanguageToggle translationUrl={translationUrl} />
            <Separator orientation="vertical" className="h-6" />
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div className="border-b-4 border-slate-100 transition-colors duration-1000 ease-in-out dark:border-slate-800">
        <div className="container mx-auto flex items-center justify-between lg:px-12">
          <Navigation />
          <div className="flex items-center gap-4">
            <SearchModal />
            <Separator orientation="vertical" className="h-6" />
            Subscribe
          </div>
        </div>
      </div>
    </header>
  )
}
