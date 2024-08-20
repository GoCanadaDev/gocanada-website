import { Logo } from "~/components/Logo"
import { ThemeToggle } from "~/components/ThemeToggle"
import { Instagram } from "lucide-react"
import useBoop from "~/lib/useBoop"
import { animated } from "react-spring"
import { MouseEventHandler } from "react"
import { Separator } from "~/components/ui/separator"
import SearchModal from "~/components/search/SearchModal"
import { Navigation } from "./Navigation"
import TopAdBanner from "./TopAdBanner"

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
      <TopAdBanner />
      <div className="border-b border-slate-900 transition-colors duration-1000 ease-in-out dark:border-slate-800">
        <div className="container mx-auto flex items-center justify-between p-4 lg:px-12">
          <Logo />
          <div className="flex items-center gap-1 md:gap-4">
            <a
              onMouseEnter={trigger as MouseEventHandler<HTMLAnchorElement>}
              href="https://instagram.com/canada"
              className="flex flex-col items-center justify-center rounded-md p-1 transition-colors duration-200 hover:text-brand focus:bg-slate-100 focus:text-brand focus:outline-none md:p-2 dark:focus:bg-slate-800"
            >
              <span>
                <animated.span style={style} className="inline-block">
                  <Instagram className="inline" />
                </animated.span>
                <span className="relative top-0.5 pl-2 text-sm uppercase md:text-base">
                  @canada
                </span>
              </span>
            </a>
            <Separator orientation="vertical" className="inline-flex h-6" />
            <SearchModal />
            {/* <Separator
              orientation="vertical"
              className="hidden h-6 md:inline-flex"
            /> */}
            {/* <div className="hidden md:inline-flex">
              <LanguageToggle translationUrl={translationUrl} />
            </div> */}
            <Separator orientation="vertical" className="h-6" />
            <div className="">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-slate-900 transition-colors duration-1000 ease-in-out dark:border-slate-800">
        <div className="flex w-screen items-center justify-between lg:container lg:px-12">
          <Navigation />
          {/* <div className="flex items-center gap-4">Subscribe</div> */}
        </div>
      </div>
    </header>
  )
}
