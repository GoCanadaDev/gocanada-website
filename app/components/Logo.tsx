import { Link } from "@remix-run/react"
import { animated } from "react-spring"

import useBoop from "~/lib/useBoop"
import { MouseEventHandler } from "react"
import MapleLeaf from "~/components/MapleLeaf"

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
    <animated.p className="text-lg font-bold tracking-tighter text-black dark:text-white lg:text-2xl">
      <Link
        to="/"
        className="relative pl-8"
        onMouseEnter={trigger as MouseEventHandler<HTMLAnchorElement>}
      >
        <animated.span style={style} className="absolute inset-0 h-8 w-8 ">
          <MapleLeaf className="rotate-45" />
        </animated.span>
        GoCanada
      </Link>
    </animated.p>
  )
}
