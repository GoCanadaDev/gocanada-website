import { client } from "~/sanity/client"
import { getSession } from "../sessions"

export async function getDraftMode(request: Request) {
  const draftSession = await getSession(request.headers.get("Cookie"))
  const draft = draftSession.get("projectId") === client.config().projectId

  if (draft && !process.env.SANITY_READ_TOKEN) {
    throw new Error(
      `Cannot activate draft mode without a 'SANITY_READ_TOKEN' token in your environment variables.`
    )
  }

  return draft
}
