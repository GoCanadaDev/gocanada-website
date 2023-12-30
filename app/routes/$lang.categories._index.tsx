import { useParams } from "@remix-run/react"

export default function CategoriesRoute() {
  const params = useParams()
  const lang = params.lang

  // Fetch data based on language and category
  // Render components accordingly

  return (
    <div>
      <h1>
        List of all categories in {lang} language
      </h1>
    </div>
  )
}
