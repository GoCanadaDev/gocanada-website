import {
  DynamicWidgets,
  Hits,
  HitsPerPage,
  InstantSearch,
  InstantSearchSSRProvider,
  InstantSearchServerState,
  Pagination,
  PoweredBy,
  SearchBox,
} from "react-instantsearch"
import { history } from "instantsearch.js/cjs/lib/routers/index.js"
import { algoliaSearchClient } from "~/algolia"
import {
  FallbackComponent,
  Hit,
  NoResults,
  NoResultsBoundary,
  ScrollTo,
} from "~/components/search"

type SSRSearchProviderProps = {
  serverState?: InstantSearchServerState
  serverUrl?: string
  themePreference?: "dark" | "light"
}

export const SSRSearchProvider = ({
  serverState,
  serverUrl,
  themePreference,
}: SSRSearchProviderProps) => {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        searchClient={algoliaSearchClient}
        indexName="posts"
        future={{
          preserveSharedStateOnUnmount: true,
        }}
        routing={{
          router: history({
            cleanUrlOnDispose: false,
            getLocation() {
              if (typeof window === "undefined") {
                return new URL(serverUrl!) as unknown as Location
              }

              return window.location
            },
          }),
        }}
      >
        <ScrollTo className="flex">
          <div>
            <DynamicWidgets fallbackComponent={FallbackComponent} />
          </div>

          <div className="mt-4 flex w-full flex-col">
            <SearchBox
              placeholder="Search by location, tag, or keyword..."
              classNames={{
                submit: "hidden",
                form: "flex gap-4",
                reset: "hidden",
                input:
                  "w-full sm:text-md block rounded-md border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500",
              }}
            />
            <div className="ml-auto mt-2">
              <PoweredBy
                className="w-32"
                theme={themePreference === "dark" ? "dark" : "light"}
              />
            </div>
            <NoResultsBoundary fallback={<NoResults />}>
              <Hits
                hitComponent={Hit}
                classNames={{
                  list: "grid grid-cols-1 gap-4 sm:grid-cols-2",
                  item: "p-2 w-full border-b",
                }}
              />
              <HitsPerPage
                items={[
                  { label: "2 hits per page", value: 2, default: true },
                  { label: "16 hits per page", value: 16 },
                ]}
              />
              <Pagination className="flex self-center" />
            </NoResultsBoundary>
          </div>
        </ScrollTo>
      </InstantSearch>
    </InstantSearchSSRProvider>
  )
}
