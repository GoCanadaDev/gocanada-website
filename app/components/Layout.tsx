import { ArrowUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Footer } from "~/components/Footer"
import { Header } from "~/components/Header"
import { Toaster } from "~/components/ui/sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

type LayoutProps = {
  children: React.ReactNode
  translationUrl?: string
  useMargins?: boolean
}

export function Layout({ children, translationUrl, useMargins }: LayoutProps) {
  const classes = useMargins
    ? "container mx-auto grid grid-cols-1 gap-4 py-4 lg:gap-12 lg:px-12"
    : undefined

  const [showGoTop, setShowGoTop] = useState(false)

  useEffect(() => {
    const handleVisibleButton = () => {
      const position = window.scrollY
      const width = window.innerWidth
      if (width < 1024) {
        return setShowGoTop(position > 1000)
      }
      return null
    }
    window.addEventListener("scroll", handleVisibleButton)

    return () => window.removeEventListener("scroll", handleVisibleButton)
  }, [])

  const refScrollUp = useRef<HTMLDivElement>(null)

  const handleScrollUp = () => {
    refScrollUp.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <div ref={refScrollUp} />
      <Header translationUrl={translationUrl} />
      <main className={classes} id="main">
        {children}
        <Toaster closeButton />
      </main>
      <Footer />
      {showGoTop && (
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleScrollUp}
                  className="fixed bottom-4 right-4 rounded-full bg-zinc-200 p-2 hover:bg-zinc-100 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                >
                  <ArrowUp />
                </button>
              </TooltipTrigger>
              <TooltipContent>Back to top</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </>
  )
}
