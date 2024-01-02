import { useRouteLoaderData } from "@remix-run/react"

import type { RootLoaderData as RootLoader } from "~/root"

export function useRootLoaderData() {
  // using `as RootLoader` works better than useRouteLoaderData<RootLoader>("root") for some reason
  const data = useRouteLoaderData("root") as RootLoader

  return data!
}
