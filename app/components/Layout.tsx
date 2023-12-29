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
    ? "container mx-auto grid grid-cols-1 gap-4 p-4 lg:gap-12 lg:p-12"
    : ""
  return (
    <>
      <Header translationUrl={translationUrl} />
      <main className={classes}>{children}</main>
      <Footer />
      <Toaster richColors closeButton />
    </>
  )
}
