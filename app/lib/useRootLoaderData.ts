import { useRouteLoaderData } from "@remix-run/react"

import type { RootLoaderData as RootLoader } from "~/root"

export function useRootLoaderData() {
  const data = useRouteLoaderData<RootLoader>(`root`)

  return data!
}
