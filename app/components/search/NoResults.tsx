import { Search } from "lucide-react"
import { useInstantSearch } from "react-instantsearch"
import { Typography } from "~/components/Typography"

export const NoResults = () => {
  const { indexUiState } = useInstantSearch()

  return (
    <div className="my-8 flex w-full items-center justify-center">
      <div className="text-center">
        <Search className="mb-4 inline h-12 w-12" />
        <Typography.H4 className="text-xl text-brand">
          No results found{" "}
          {indexUiState.query === undefined ? (
            ""
          ) : (
            <>
              for <q>{indexUiState.query}</q>.
            </>
          )}
        </Typography.H4>
        <Typography.Paragraph>
          Try adjusting your search to find what you're looking for.
        </Typography.Paragraph>
      </div>
    </div>
  )
}
