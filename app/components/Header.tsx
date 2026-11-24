import { Instagram } from "lucide-react"
import type { MouseEventHandler } from "react"
import { animated } from "react-spring"

import { Logo } from "~/components/Logo"
import SearchModal from "~/components/search/SearchModal"
import { ThemeToggle } from "~/components/ThemeToggle"
import { Separator } from "~/components/ui/separator"
import { useBoop } from "~/lib/useBoop"

import { DestinationsNav } from "./DestinationsNav"
import { MobileNavigation } from "./MobileNavigation"
import { SubscribeModal } from "./SubscribeModal"
import { TopAdBanner } from "./TopAdBanner"

export function Header() {
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 5 })

  return (
    <header>
      <a
        href="#main"
        className="sr-only left-1/2 z-50 translate-x-[-50%] rounded-b-md focus:not-sr-only focus:fixed focus:bg-zinc-100 focus:p-4 dark:focus:bg-zinc-800"
      >
        Skip to main content
      </a>
      <TopAdBanner />
      <div className="">
        <div className="container mx-auto flex items-center justify-between p-4 lg:px-12">
          <div className="flex">
            <Logo />
            <DestinationsNav />
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <SubscribeModal pageLocation="header" />
            <Separator orientation="vertical" className="inline-flex h-6" />
            <a
              onMouseEnter={trigger as MouseEventHandler<HTMLAnchorElement>}
              href="https://www.instagram.com/canada/"
              className="flex flex-col items-center justify-center rounded-md p-1 transition-colors duration-200 hover:text-brand focus:bg-zinc-100 focus:text-brand focus:outline-none dark:focus:bg-zinc-800"
              target="_blank"
              rel="me noopener"
            >
              <span>
                <animated.span style={style} className="inline-block">
                  <Instagram className="inline" />
                </animated.span>
                <span className="relative hidden pl-2 text-sm uppercase tracking-wide sm:inline md:text-base">
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
            <Separator orientation="vertical" className="h-6" />
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  )
}
