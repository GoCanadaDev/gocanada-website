import { Link } from "@remix-run/react"
import { Logo } from "~/components/Logo"
import { Separator } from "~/components/ui/separator"
import { Fragment } from "react"
import { useRootLoaderData } from "~/lib/useRootLoaderData"
import { SupportedLanguages } from "~/i18n"
import { useTranslation } from "react-i18next"

export function Footer() {
  const { footerLinks } = useRootLoaderData()
  const {
    i18n: { language },
  } = useTranslation()
  const currentLang = language as SupportedLanguages

  return (
    <footer className="border-t-4 border-slate-100 transition-colors duration-1000 ease-in-out dark:border-slate-800">
      <div className="container mx-auto flex items-center justify-between p-4 lg:px-12">
        <Logo />
      </div>
      <div className="container mx-auto p-4 lg:px-12">
        {/* width: 100%; overflow: hidden; margin: 0 0 1.375rem; padding: 0.25rem 0
        0; list-style: none; text-align: center; text-transform: uppercase;
        font-size: 0; line-height: 0; */}
        <nav
          className="flex flex-wrap items-center justify-center text-sm uppercase"
          role="menu"
        >
          {footerLinks.map((link, index) => (
            <Fragment key={link.title[currentLang]}>
              <Link
                to={`/${currentLang}${link.route}`}
                role="menuitem"
                className="block px-8 py-4 tracking-widest"
              >
                {link.title[currentLang]}
              </Link>

              {index !== footerLinks.length - 1 && (
                <Separator orientation="vertical" className="h-6" />
              )}
            </Fragment>
          ))}
        </nav>
      </div>
      <div className="container mx-auto p-8 text-center text-xs lg:px-12">
        &copy; {new Date().getFullYear()} GoCanada, a division of{" "}
        <a href="https://www.stayandwander.com/" className="hover:underline">
          Stay &amp; Wander Media Inc.
        </a>{" "}
        All Rights Reserved.
      </div>
    </footer>
  )
}
