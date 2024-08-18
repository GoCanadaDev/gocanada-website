import { Link } from "@remix-run/react"
import GoCanadaLogoColour from "../../public/images/logotype-colour.png"
import GoCanadaLogoReverse from "../../public/images/logotype-colour-reverse.png"
import { useRootLoaderData } from "~/lib/useRootLoaderData"

export function Logo() {
  const { themePreference } = useRootLoaderData()
  return (
    <Link
      to="/"
      className="rounded-md hover:opacity-90 focus:opacity-90 focus-visible:outline-none active:bg-transparent "
    >
      <span className="sr-only">GoCanada</span>
      <img
        src={
          themePreference === "dark" ? GoCanadaLogoReverse : GoCanadaLogoColour
        }
        alt="Go Canada Logo"
        className="w-32 md:w-48"
      />
    </Link>
  )
}
