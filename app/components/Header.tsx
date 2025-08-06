import { Instagram } from "lucide-react"
import { Link } from "@remix-run/react"
import { Logo } from "~/components/Logo"
import { MobileNavigation } from "./MobileNavigation"
import { MouseEventHandler } from "react"
import { Navigation } from "./Navigation"
import SearchModal from "~/components/search/SearchModal"
import { Separator } from "~/components/ui/separator"
import SubscribeModal from "./SubscribeModal"
import { ThemeToggle } from "~/components/ThemeToggle"
import TopAdBanner from "./TopAdBanner"
import { animated } from "react-spring"
import useBoop from "~/lib/useBoop"
import { useRootLoaderData } from "~/lib/useRootLoaderData"

export function Header() {
  const { spotlightPost } = useRootLoaderData()
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 5 })

  return (
    <header>
      <a
        href="#main"
        className="sr-only left-1/2 z-50 rounded-b-md focus:not-sr-only focus:fixed focus:bg-zinc-100 focus:p-4 dark:focus:bg-zinc-800"
      >
        Skip to main content
      </a>
      <TopAdBanner />
      <div className="border-b border-zinc-900 transition-colors duration-1000 ease-in-out dark:border-zinc-100">
        <div className="container mx-auto flex items-center justify-between p-4 lg:px-12">
          <Logo />
          <div className="flex items-center gap-1 md:gap-2">
            <a
              onMouseEnter={trigger as MouseEventHandler<HTMLAnchorElement>}
              href="https://instagram.com/canada"
              className="flex flex-col items-center justify-center rounded-md p-1 transition-colors duration-200 hover:text-brand focus:bg-zinc-100 focus:text-brand focus:outline-none dark:focus:bg-zinc-800"
              target="_blank"
              rel="noopener"
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
      <div className="border-b border-zinc-900 transition-colors duration-1000 ease-in-out dark:border-zinc-100">
        <div className="flex w-screen flex-col items-start justify-between px-4 pb-2 lg:container md:flex-row md:items-center md:py-1 lg:px-12">
          <Navigation />
          <MobileNavigation />
          <SubscribeModal pageLocation="header" />
        </div>
      </div>
      {spotlightPost && Object.keys(spotlightPost).length > 0 && (
        <div className="border-b border-zinc-900 transition-colors duration-1000 ease-in-out dark:border-zinc-100">
          <div className="flex w-screen flex-col items-start justify-start px-4 py-2 lg:container md:flex-row md:items-center lg:px-12">
            <Link
              to={`/en/${spotlightPost.link}`}
              className="block font-serif text-xl text-brand hover:underline"
            >
              {spotlightPost.text}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
