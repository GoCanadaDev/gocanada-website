import { useLoaderData } from "@remix-run/react"
import { LogOut } from "lucide-react"

export function Preview({ children }: { children: React.ReactNode }) {
  const { isDraftMode } = useLoaderData<{ isDraftMode: boolean }>()

  return (
    <>
      {isDraftMode && (
        <a
          href="/api/disable-draft"
          className="fixed right-0 top-0 z-50 flex gap-2 rounded-bl bg-brand p-3 text-sm text-white transition-all duration-200 hover:gap-4 hover:bg-brandHover"
        >
          Exit Preview Mode <LogOut className="inline-block size-4" />
        </a>
      )}
      {children}
    </>
  )
}
