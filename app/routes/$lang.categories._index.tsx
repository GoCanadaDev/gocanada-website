import { useParams } from "@remix-run/react"
import { json, LoaderFunction } from "@remix-run/node"
import invariant from "tiny-invariant"
import { getPosts } from "~/sanity/queries"
import { client } from "~/sanity/client"

interface IndexLoaderData {}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.lang, "Expected lang param")
  const posts = await getPosts(client, params.lang!)

  return json<IndexLoaderData>({
    posts,
  })
}

export default function CategoriesRoute() {
  const params = useParams()
  const lang = params.lang

  // Fetch data based on language and category
  // Render components accordingly

  return (
    <div>
      <h1>List of all categories in {lang} language</h1>
    </div>
  )
}
