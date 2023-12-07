import { Logo } from "~/components/Logo"
import { ThemeToggle } from "~/components/ThemeToggle"
import { LanguageToggle } from "~/components/LanguageToggle"
import type { LogoProps } from "~/types/home"

export function Header(props: LogoProps) {
  return (
    <header className="border-b border-gray-100 transition-colors duration-1000 ease-in-out dark:border-gray-900">
      <div className="container mx-auto flex items-center justify-between p-4 lg:px-12">
        <Logo home={props.home} />
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
