import { useLoaderData } from "@remix-run/react"

export function Preview({ children }: { children: React.ReactNode }) {
  const { isDraftMode } = useLoaderData<{ isDraftMode: boolean }>()

  return (
    <>
      {isDraftMode && (
        <div
          style={{
            backgroundColor: "#f00",
            color: "#fff",
            padding: "10px",
            position: "fixed",
            bottom: 0,
            right: 0,
            zIndex: 9999,
          }}
        >
          Preview Mode
          <a
            href="/api/disable-draft"
            style={{ marginLeft: "10px", color: "#fff" }}
          >
            Exit Preview
          </a>
        </div>
      )}
      {children}
    </>
  )
}
