import type { LoaderFunctionArgs } from "@remix-run/node"
import invariant from "tiny-invariant"

import { generatePngFromDocument } from "~/lib/og.server"
import { previewClient } from "~/sanity/client.server"

export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { origin, searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  invariant(id, "Expected id in searchParams")

  if (!id) {
    return new Response("Bad request", { status: 400 })
  }

  const doc = await previewClient.fetch(`*[_id == $id][0]{ ..., author-> }`, {
    id,
  })

  // Reject requests for documents that don't exist
  if (!doc) {
    return new Response("Bad request", { status: 400 })
  }

  const png = await generatePngFromDocument(doc, origin)

  // Respond with the PNG buffer
  return new Response(png as unknown as BodyInit, {
    status: 200,
    headers: {
      // Tell the browser the response is an image
      "Content-Type": "image/png",
      "cache-control":
        process.env.NODE_ENV === "development"
          ? "no-cache"
          : "public, immutable, no-transform, max-age=31536000",
      // Cache at CDN level for fast delivery
      "Netlify-CDN-Cache-Control": "public, immutable, s-maxage=31536000",
      // Tag with post id so it can be purged when post is updated
      "Cache-Tag": `posts:id:${id}`,
    },
  })
}
