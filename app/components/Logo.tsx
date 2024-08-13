import { Link } from "@remix-run/react"
import GoCanadaLogo from "../../public/images/logotype-colour.png"

export function Logo() {
  return (
    <Link
      to="/"
      className="rounded-md hover:opacity-90 focus:opacity-90 focus-visible:outline-none active:bg-transparent "
    >
      <span className="sr-only">GoCanada</span>
      <img src={GoCanadaLogo} alt="GoCanada Logo" className="w-32 md:w-48" />
    </Link>
  )
}
