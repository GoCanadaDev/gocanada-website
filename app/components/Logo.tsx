import { Link } from "@remix-run/react"
import GoCanadaLogoRed from "../../public/images/logotype-red.png"

export function Logo() {
  return (
    <Link
      to="/"
      className="rounded-md p-2 hover:opacity-90 focus:bg-slate-100 focus-visible:outline-none dark:focus:bg-slate-800"
    >
      <span className="sr-only">GoCanada</span>
      <img src={GoCanadaLogoRed} alt="GoCanada Logo" className="w-40" />
    </Link>
  )
}
