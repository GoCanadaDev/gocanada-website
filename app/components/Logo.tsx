import { Link } from "@remix-run/react"
import { animated } from "react-spring"

import useBoop from "~/lib/useBoop"
import { MouseEventHandler } from "react"
import MapleLeaf from "~/components/MapleLeaf"
import GoCanadaLogoRed from "../../public/images/Go Canada Logo - red.png"

export function Logo() {
  const [style, trigger] = useBoop({
    scale: 1,
    rotation: -45,
    timing: 500,
    springConfig: {
      tension: 200,
      friction: 10,
    },
  })

  return (
    // <animated.p className="-ml-2 rounded-md p-2 text-lg font-bold tracking-tighter text-black focus-within:bg-slate-100 lg:text-2xl dark:text-white dark:focus-within:bg-slate-800">
    <Link
      to="/"
      className="rounded-md p-2 focus:bg-slate-100 focus-visible:outline-none dark:focus:bg-slate-800"
      // onMouseEnter={trigger as MouseEventHandler<HTMLAnchorElement>}
    >
      {/* <animated.span style={style} className="absolute inset-0 size-8">
          <MapleLeaf className="rotate-45" />
        </animated.span> */}
      <span className="sr-only">GoCanada</span>
      <img src={GoCanadaLogoRed} alt="GoCanada Logo" className="w-32" />
    </Link>
    // </animated.p>
  )
}
