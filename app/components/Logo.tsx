import { Link } from "@remix-run/react"
import { animated } from "react-spring"

import type { LogoProps } from "~/types/home"
import useBoop from "~/lib/useBoop"
import { MouseEventHandler } from "react"
import MapleLeaf from "~/components/MapleLeaf"

export function Logo(props: LogoProps) {
  const [style, trigger] = useBoop({
    scale: 1,
    rotation: -45,
    timing: 500,
    springConfig: {
      tension: 200,
      friction: 10,
    },
  })
  const { siteTitle } = props.home ?? {}

  if (!siteTitle && typeof document !== `undefined`) {
    console.info(
      `Create and publish "home" document in Sanity Studio at ${window.origin}/studio/desk/home`
    )
  }

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
        {/* <LeafAnimation style={style} className="absolute text-red-700" /> */}
        {siteTitle ?? `Go Canada`}
      </Link>
    </animated.p>
  )
}
