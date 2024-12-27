import { redirect, type LoaderFunctionArgs } from "react-router"

import { destroySession, getSession } from "../sessions"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"))

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  })
}
