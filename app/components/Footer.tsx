import { Link } from "@remix-run/react"
import { Logo } from "~/components/Logo"
import type { LogoProps } from "~/types/home"

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
      <div className="container mx-auto flex flex-wrap items-center justify-evenly p-4 text-center text-sm uppercase tracking-wide lg:px-12">
        <Link to="/" className="block p-4">
          About
        </Link>
        <Link to="/" className="block p-4">
          Advertising
        </Link>
        <Link to="/" className="block p-4">
          Contact
        </Link>
        <Link to="/" className="block p-4">
          Media
        </Link>
        <Link to="/" className="block p-4">
          Privacy Policy
        </Link>
        <Link to="/" className="block p-4">
          Terms of Use
        </Link>
      </div>
      <div className="container mx-auto p-4 text-center text-xs lg:px-12">
        &copy; {new Date().getFullYear()} GoCanada, a division of{" "}
        <a href="https://www.stayandwander.com/" className="hover:underline">
          Stay &amp; Wander Media Inc.
        </a>{" "}
        All Rights Reserved.
      </div>
    </footer>
  )
}
