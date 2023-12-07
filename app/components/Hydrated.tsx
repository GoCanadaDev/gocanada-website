import type { PropsWithChildren } from "react"
import { useEffect, useState } from "react"

// We can safely track hydration in memory state
// outside of the component because it is only
// updated once after the version instance of
// `SomeComponent` has been hydrated. From there,
// the browser takes over rendering duties across
// route changes and we no longer need to worry
// about hydration mismatches until the page is
// reloaded and `isHydrating` is reset to true.
let isHydrating = true

// https://remix.run/docs/en/main/guides/migrating-react-router-app#client-only-components
export function Hydrated(props: PropsWithChildren): JSX.Element {
  const [isHydrated, setIsHydrated] = useState(!isHydrating)

  useEffect(() => {
    isHydrating = false
    setIsHydrated(true)
  }, [])

  return isHydrated && props.children ? <>{props.children}</> : <></>
}
