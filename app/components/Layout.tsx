import { Footer } from "~/components/Footer"
import { Header } from "~/components/Header"
import { Toaster } from "~/components/ui/sonner"

type LayoutProps = {
  children: React.ReactNode
  translationUrl?: string
  useMargins?: boolean
}

export function Layout({ children, translationUrl, useMargins }: LayoutProps) {
  const classes = useMargins
    ? "container mx-auto grid grid-cols-1 gap-4 py-4 lg:gap-12 lg:px-12"
    : undefined
  return (
    <>
      <Header translationUrl={translationUrl} />
      <main className={classes} id="main">
        {children}
        <Toaster closeButton />
      </main>
      <Footer />
    </>
  )
}
