import { Link } from "@remix-run/react"
import { Logo } from "~/components/Logo"
import type { LogoProps } from "~/types/home"

const navLinks = [
  {
    title: "About",
    url: "/",
  },
  {
    title: "Advertising",
    url: "/",
  },
  {
    title: "Contact",
    url: "/",
  },
  {
    title: "Media",
    url: "/",
  },
  {
    title: "Privacy Policy",
    url: "/",
  },
  {
    title: "Terms of Use",
    url: "/",
  },
]

export function Footer(props: LogoProps) {
  return (
    <footer className="border-t-4 border-slate-100 transition-colors duration-1000 ease-in-out dark:border-slate-800">
      <div className="container mx-auto flex items-center justify-between p-4 lg:px-12">
        <Logo home={props.home} />
        <div className="flex max-w-sm flex-1 flex-col items-end justify-end gap-2 text-right text-sm lg:flex-row lg:items-center lg:gap-5">
          <Link
            className="hover:text-cyan-600 dark:hover:text-cyan-200"
            to="/studio"
          >
            Log in to Sanity Studio v3
          </Link>
        </div>
      </div>
      <div className="container mx-auto p-4 lg:px-12">
        {/* width: 100%; overflow: hidden; margin: 0 0 1.375rem; padding: 0.25rem 0
        0; list-style: none; text-align: center; text-transform: uppercase;
        font-size: 0; line-height: 0; */}
        <ul className="text-center text-sm uppercase">
          {navLinks.map((link, index) => (
            <li
              className={
                index !== navLinks.length - 1
                  ? "mb-4 inline-block border-r"
                  : "mb-4 inline-block"
              }
              key={link.title}
            >
              <Link to={link.url} className=" block px-8 tracking-widest">
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
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
