import { useInstantSearch } from "react-instantsearch"
import { Typography } from "~/components/Typography"

export const NoResults = () => {
  const { indexUiState } = useInstantSearch()

  return (
    <div className="flex w-full items-center justify-center">
      <Typography.TextMuted>
        {indexUiState.query === undefined ? (
          ""
        ) : (
          <>
            No results for <q>{indexUiState.query}</q>.
          </>
        )}
      </Typography.TextMuted>
    </div>
  )
}
