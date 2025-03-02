import { client } from "~/sanity/client"
import { getSession } from "../sessions"

export async function getDraftMode(request: Request) {
  const draftSession = await getSession(request.headers.get("Cookie"))

  // First check if projectId exists in the session, then compare values
  const sessionProjectId = draftSession.get("projectId")
  const draft =
    Boolean(sessionProjectId) && sessionProjectId === client.config().projectId

  if (draft && !process.env.SANITY_READ_TOKEN) {
    throw new Error(
      `Cannot activate draft mode without a 'SANITY_READ_TOKEN' token in your environment variables.`
    )
  }

  // Add debug logging
  console.log("Draft mode check:", {
    sessionProjectId,
    configProjectId: client.config().projectId,
    isDraft: draft,
  })

  return draft
}
