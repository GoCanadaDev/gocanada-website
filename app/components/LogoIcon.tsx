import { Link } from "@remix-run/react"
import GoCanadaLogoRed from "../../public/images/icon-red-sm.png"

export function LogoIcon() {
  return (
    <Link
      to="/"
      className="rounded-md p-2 hover:opacity-90 focus:bg-zinc-100 focus-visible:outline-none dark:focus:bg-zinc-800"
    >
      <span className="sr-only">Go Canada</span>
      <img
        src={GoCanadaLogoRed}
        alt="Go Canada Logo"
        className="w-24"
        width={96}
        height={55}
      />
    </Link>
  )
}
