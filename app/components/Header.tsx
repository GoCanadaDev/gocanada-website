import { Logo } from "~/components/Logo"
import { ThemeToggle } from "~/components/ThemeToggle"
import { LanguageToggle } from "~/components/LanguageToggle"
import type { LogoProps } from "~/types/home"
import { Instagram } from "lucide-react"

export function Header(props: LogoProps) {
  return (
    <header className="border-b-4 border-slate-100 transition-colors duration-1000 ease-in-out dark:border-slate-800">
      <div className="container mx-auto flex items-center justify-between p-4 lg:px-12">
        <Logo home={props.home} />
        <div className="flex items-center gap-8">
          <a
            href="https://instagram.com/canada"
            className="transition-colors duration-200 hover:text-red-700"
          >
            <Instagram className="inline" /> @canada
          </a>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
