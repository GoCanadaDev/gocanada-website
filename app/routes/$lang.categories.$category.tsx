import { useParams } from "@remix-run/react"

export default function CategoriesRoute() {
  const params = useParams()
  const lang = params.lang
  const category = params.category

  // Fetch data based on language and category
  // Render components accordingly

  return (
    <div>
      <h1>
        Category: {lang} - {category}
      </h1>
    </div>
  )
}
