import { AlertTriangle } from "lucide-react"

export default function ErrorBoundaryPage({ error }: { error: string }) {
  console.error(error)
  return (
    <div className="flex h-[90%] items-center justify-center overflow-hidden rounded-lg sm:h-[92%]">
      <div className="h-auto w-5/6 max-w-[800px] rounded-lg bg-slate-100 p-6 shadow dark:bg-slate-800">
        <div className="mb-4 flex w-full items-center justify-center">
          <AlertTriangle size={72} className="text-red-500" />
        </div>
        <h1 className="mb-3 w-full text-center text-2xl font-medium sm:text-3xl">
          Something went wrong
        </h1>
        <div className="mb-4 flex w-full justify-between sm:mb-6">
          <div className="flex h-full w-full flex-col justify-between">
            <h2 className="text-center text-sm tracking-wide sm:text-lg">
              Please refresh the page and try again. If the problem persists,
              please reach out to {/* TODO */}
              <span className="italic">support@gocanada.com.</span>
            </h2>
          </div>
        </div>
        {error && (
          <div className="max-h-[200px] w-full overflow-auto rounded bg-red-100 p-4">
            <pre className="whitespace-normal text-xs sm:text-sm">{error}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
