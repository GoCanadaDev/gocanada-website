import type { MetaFunction, LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useTranslation } from "react-i18next"
import ErrorBoundaryPage from "~/components/ErrorBoundaryPage"

import { Records } from "~/components/Records"
import type { LoaderData as RootLoader } from "~/root"
import { useQuery } from "~/sanity/loader"
import { loadQuery } from "~/sanity/loader.server"
import { RECORDS_QUERY } from "~/sanity/queries"
import type { RecordStub } from "~/types/record"
import { recordStubsZ } from "~/types/record"

export const meta: MetaFunction<
  typeof loader,
  {
    root: RootLoader
  }
> = ({ matches }) => {
  const rootData = matches.find((match) => match.id === `root`)
    ?.data as RootLoader
  const home = rootData ? rootData.initial.data : null
  const title = [home?.title, home?.siteTitle].filter(Boolean).join(" | ")

  return [{ title }]
}

type IndexLoaderData = {
  initial: any
  query: typeof RECORDS_QUERY
  params: Record<string, string>
}

export const loader: LoaderFunction = async () => {
  const initial = await loadQuery<RecordStub[]>(RECORDS_QUERY).then((res) => ({
    ...res,
    data: res.data ? recordStubsZ.parse(res.data) : null,
  }))

  if (!initial.data) {
    throw new Response("Not found", { status: 404 })
  }

  return json<IndexLoaderData>({
    initial,
    query: RECORDS_QUERY,
    params: {},
  })
}

export default function Index() {
  const { initial, query, params } = useLoaderData() as IndexLoaderData
  const { data, loading } = useQuery<typeof initial.data>(query, params, {
    initial,
  })

  let { t } = useTranslation()

  if (loading || !data) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:gap-12">
      <h1>{t("greeting")}</h1>
      <Records records={data} />
    </div>
  )
}

export function ErrorBoundary({ error }: { error: string }) {
  return <ErrorBoundaryPage error={error?.toString()} />
}
