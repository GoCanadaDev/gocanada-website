import { useState, useEffect } from "react"
import { Link } from "react-router"
import { LogoIcon } from "~/components/LogoIcon"
import { Separator } from "~/components/ui/separator"
import { Fragment } from "react"
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
import SubscribeForm from "./SubscribeForm"

export function Footer() {
  const [style, trigger] = useBoop({ scale: 1.1, rotation: 5 })
  const [style2, trigger2] = useBoop({ scale: 1.1, rotation: 5 })
  const { footerLinks, partners, siteConfig } = useRootLoaderData()
  const {
    i18n: { language },
  } = useTranslation()
  const currentLang = language as SupportedLanguages

  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-zinc-900 transition-colors duration-1000 ease-in-out dark:bg-zinc-950">
      {/* <div className="container mx-auto flex items-center justify-between pb-4 pt-8 lg:px-12">
        <LogoIcon />
      </div> */}
      {siteConfig.enablePartners && (
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 p-4 lg:px-12">
          <Typography.H4>Partners</Typography.H4>
          <ul className="flex justify-center gap-8" role="list">
            {partners.length > 0 &&
              partners.map((partner) => (
                <li role="listitem" key={partner.name}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a href={partner.link} target="_blank" rel="noopener">
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
      )}
      <div className="container mx-auto flex flex-wrap gap-8 p-4 md:flex-nowrap lg:px-12">
        <div className="w-full space-y-8 pt-4 text-center md:w-1/2">
          <LogoIcon />
          <div className="max-w-prose text-left text-zinc-400">
            <Typography.Paragraph className="mb-2 text-pretty text-zinc-300">
              {siteConfig.siteDescription}
            </Typography.Paragraph>
            <Typography.TextMuted className="text-pretty leading-6">
              {siteConfig.footerText}
            </Typography.TextMuted>
          </div>
        </div>
        <div className="w-full pt-8 text-center md:w-1/2">
          <Typography.H4 className="text-zinc-300">Follow Us</Typography.H4>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 md:flex-nowrap">
            <a
              onMouseEnter={trigger}
              href="https://instagram.com/canada"
              className="flex items-center text-brand transition-colors duration-200 hover:text-brandHover"
              target="_blank"
              rel="noopener"
            >
              <animated.span style={style} className="inline-block">
                <Instagram className="inline" size={40} />
              </animated.span>
              <span className="pl-2 text-xl uppercase">@canada</span>
            </a>
            <a
              onMouseEnter={trigger2}
              href="https://threads.net/canada"
              className="flex items-center text-brand transition-colors duration-200 hover:text-brandHover"
              target="_blank"
              rel="noopener"
            >
              <animated.span style={style2} className="inline-block">
                <svg
                  aria-label="Threads"
                  fill="#bf2327"
                  className="size-[40px] text-brand"
                  height="100%"
                  role="img"
                  viewBox="0 0 192 192"
                  width="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
                </svg>
              </animated.span>
              <span className="pl-2 text-xl uppercase">@canada</span>
            </a>
          </div>
          <div className="m-auto my-12 max-w-md">
            <h4 className="font-serif text-2xl text-zinc-300">
              Sign up for the Go Canada newsletter
            </h4>
            <SubscribeForm pageLocation="footer" />
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4 lg:px-12">
        <nav
          className="flex flex-wrap items-start justify-start text-sm uppercase md:items-center md:justify-center"
          role="menu"
        >
          {footerLinks.map((link, index) => (
            <Fragment key={link.title[currentLang]}>
              <Link
                to={`/${currentLang}${link.route}`}
                role="menuitem"
                prefetch="intent"
                className="block w-1/2 px-2 py-4 tracking-widest text-zinc-300 transition-colors duration-200 hover:text-brandHover md:w-auto md:px-8"
              >
                {link.title[currentLang]}
              </Link>

              {index !== footerLinks.length - 1 && (
                <Separator
                  orientation="vertical"
                  className="hidden h-6 md:block"
                />
              )}
            </Fragment>
          ))}
        </nav>
      </div>
      <div className="container mx-auto pb-8 pt-4 text-center text-xs text-zinc-300 lg:px-12">
        &copy; {year} Go Canada, a division of Stay &amp; Wander Media Inc. All
        Rights Reserved.
      </div>
    </footer>
  )
}
