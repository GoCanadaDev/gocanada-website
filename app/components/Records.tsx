import { Link } from "@remix-run/react"
import { useTranslation } from "react-i18next"

import { RecordCover } from "~/components/RecordCover"
import type { RecordStub } from "~/types/record"

type RecordsProps = {
  records: RecordStub[]
}

export function Records(props: RecordsProps) {
  const { records = [] } = props

  let { i18n } = useTranslation()

  return records.length > 0 ? (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-12">
      {records.map((record) => (
        <li key={record._id} className="group relative flex flex-col">
          <div className="relative overflow-hidden transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:opacity-90">
            <div className="absolute z-0 h-48 w-[200%] translate-x-20 translate-y-20 -rotate-45 bg-gradient-to-b from-white to-transparent opacity-25 mix-blend-overlay transition-transform duration-500 ease-in-out group-hover:translate-x-10 group-hover:translate-y-10 group-hover:opacity-75" />
            <RecordCover image={record.image} />
          </div>
          <div className="flex flex-col">
            {record?.slug ? (
              <Link
                prefetch="intent"
                to={`${i18n.language}/${record?.slug}`}
                className="text-bold pt-4 text-xl font-bold tracking-tighter transition-colors duration-100 ease-in-out hover:bg-cyan-400 hover:text-white lg:text-3xl"
              >
                {record.title}
                {/* Makes this entire block clickable */}
                {/* <span className="absolute inset-0" /> */}
              </Link>
            ) : (
              <span className="pt-4 text-xl font-bold tracking-tighter">
                {record.title}
              </span>
            )}
            {record?.artist ? (
              <span className="bg-slate-950 font-bold leading-none tracking-tighter text-white dark:bg-white dark:text-black">
                {record.artist}
              </span>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <div className="prose prose-xl mx-auto bg-green-50 p-4">
      <p>No content found, yet!</p>
      <p>
        <a href="/studio">Log in to your Sanity Studio</a> and start creating
        content!
      </p>
    </div>
  )
}
