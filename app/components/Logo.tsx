import { Link } from "@remix-run/react"
import GoCanadaLogoColour from "../../public/images/logotype-colour-sm.png"
import GoCanadaLogoReverse from "../../public/images/logotype-colour-reverse-sm.png"
import { useRootLoaderData } from "~/lib/useRootLoaderData"

export function Logo() {
  const { themePreference } = useRootLoaderData()
  return (
    <Link
      to="/"
      className="rounded-md hover:opacity-90 focus:opacity-90 focus-visible:outline-none active:bg-transparent "
    >
      <span className="sr-only">Go Canada</span>
      <img
        src={
          themePreference === "dark" ? GoCanadaLogoReverse : GoCanadaLogoColour
        }
        alt="Go Canada Logo"
        className="w-32 md:w-48"
        width={192}
        height={37}
      />
    </Link>
  )
}
