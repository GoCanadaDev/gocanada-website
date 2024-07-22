import { Logo } from "~/components/Logo"
import { ThemeToggle } from "~/components/ThemeToggle"
import { Instagram } from "lucide-react"
import useBoop from "~/lib/useBoop"
import { animated } from "react-spring"
import { MouseEventHandler } from "react"
import { Separator } from "~/components/ui/separator"
import SearchModal from "~/components/search/SearchModal"
import { Navigation } from "./Navigation"
import { MobileNavigation } from "./MobileNavigation"

export function Header({ translationUrl }: { translationUrl?: string }) {
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 5 })

  return (
    <header>
      <a
        href="#main"
        className="sr-only left-1/2 z-50 rounded-b-md focus:not-sr-only focus:fixed focus:bg-slate-100 focus:p-4 dark:focus:bg-slate-800"
      >
        Skip to main content
      </a>
      <div className=" border-b-4 border-slate-100 transition-colors duration-1000 ease-in-out dark:border-slate-800">
        <div className="container mx-auto flex items-center justify-between p-2 lg:px-12">
          <Logo />
          <div className="flex items-center gap-4">
            <a
              onMouseEnter={trigger as MouseEventHandler<HTMLAnchorElement>}
              href="https://instagram.com/canada"
              className="rounded-md p-2 transition-colors duration-200 hover:text-red-500 focus:bg-slate-100 focus:text-red-500 focus:outline-none dark:focus:bg-slate-800"
            >
              <animated.span style={style} className="inline-block">
                <Instagram className="inline" />
              </animated.span>
              <span className="pl-2">@canada</span>
            </a>
            {/* <Separator
              orientation="vertical"
              className="hidden h-6 md:inline-flex"
            /> */}
            {/* <div className="hidden md:inline-flex">
              <LanguageToggle translationUrl={translationUrl} />
            </div> */}
            <Separator
              orientation="vertical"
              className="hidden h-6 md:inline-flex"
            />
            <div className="hidden md:inline-flex">
              <ThemeToggle />
            </div>
            <Separator
              orientation="vertical"
              className="inline-flex h-6 md:hidden"
            />
            <MobileNavigation />
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
