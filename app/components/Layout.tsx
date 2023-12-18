import { Footer } from "~/components/Footer"
import { Header } from "~/components/Header"

type LayoutProps = {
  children: React.ReactNode
  translationUrl?: string
}

export function Layout({ children, translationUrl }: LayoutProps) {
  return (
    <>
      <Header translationUrl={translationUrl} />
      <div className="container mx-auto grid grid-cols-1 gap-4 p-4 lg:gap-12 lg:p-12">
        {children}
      </div>
      <Footer />
    </>
  )
}
