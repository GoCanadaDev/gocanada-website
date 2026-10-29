import { getIndexNowKey } from "~/lib/indexNow.server"

// IndexNow key file, referenced as keyLocation in submissions
export const loader = () => {
  const key = getIndexNowKey()

  if (!key) {
    return new Response("Not Found", { status: 404 })
  }

  return new Response(key, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
