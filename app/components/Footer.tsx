import { Link } from "@remix-run/react"
import { Logo } from "~/components/Logo"
import { Separator } from "~/components/ui/separator"
import { Fragment, MouseEventHandler } from "react"
import { useRootLoaderData } from "~/lib/useRootLoaderData"
import { SupportedLanguages } from "~/i18n"
import { useTranslation } from "react-i18next"
import { Image } from "./Image"
import { Typography } from "./Typography"
import useBoop from "~/lib/useBoop"
import { animated } from "react-spring"
import { Instagram } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

export function Footer() {
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 5 })
  const { footerLinks, partners } = useRootLoaderData()
  const {
    i18n: { language },
  } = useTranslation()
  const currentLang = language as SupportedLanguages

  return (
    <footer className="border-t-4 border-slate-100 transition-colors duration-1000 ease-in-out dark:border-slate-800">
      <div className="container mx-auto flex items-center justify-between p-4 lg:px-12">
        <Logo />
      </div>
      <div className="container mx-auto flex flex-wrap gap-8 p-4 md:flex-nowrap lg:px-12">
        <div className="w-full space-y-8 text-center md:w-3/4">
          <Typography.H4>Partners</Typography.H4>
          <ul className="flex justify-center gap-8" role="list">
            {partners.length > 0 &&
              partners.map((partner) => (
                <li role="listitem" key={partner.name}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a href={partner.link} target="_blank" rel="noreferrer">
                          <Image
                            id={partner.logo.id}
                            width={120}
                            preview={partner.logo.preview}
                            loading="lazy"
                            className="size-24 rounded-full"
                            alt={partner.name}
                          />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>{partner.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </li>
              ))}
          </ul>
        </div>
        <div className="w-full space-y-8 text-center md:w-1/4">
          <Typography.H4>Follow Us</Typography.H4>
          <div>
            <a
              onMouseEnter={trigger as MouseEventHandler<HTMLAnchorElement>}
              href="https://instagram.com/canada"
              className="text-red-600 transition-colors duration-200 hover:text-red-500"
            >
              <animated.span style={style} className="inline-block">
                <Instagram className="inline" size={48} />
              </animated.span>
              <span className="pl-2 text-2xl">@canada</span>
            </a>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4 lg:px-12">
        <nav
          className="flex flex-wrap items-center justify-center text-sm uppercase"
          role="menu"
        >
          {footerLinks.map((link, index) => (
            <Fragment key={link.title[currentLang]}>
              <Link
                to={`/${currentLang}${link.route}`}
                role="menuitem"
                prefetch="intent"
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
