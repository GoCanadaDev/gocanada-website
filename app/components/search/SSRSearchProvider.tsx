import {
  DynamicWidgets,
  Hits,
  InstantSearch,
  InstantSearchSSRProvider,
  InstantSearchServerState,
  PoweredBy,
  SearchBox,
} from "react-instantsearch"
import { history } from "instantsearch.js/cjs/lib/routers/index.js"
import { algoliaSearchClient } from "~/algolia"
import {
  FallbackComponent,
  Hit,
  HitsPerPage,
  NoResults,
  NoResultsBoundary,
  ScrollTo,
  SearchPagination,
} from "~/components/search"
import { Search, X } from "lucide-react"

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
        <PoweredBy
          className="w-32"
          theme={themePreference === "dark" ? "dark" : "light"}
        />
        <ScrollTo className="flex">
          <div>
            <DynamicWidgets fallbackComponent={FallbackComponent} />
          </div>
          <div className="mt-4 flex w-full flex-col">
            <SearchBox
              placeholder="Search by location, tag, or keyword..."
              classNames={{
                form: "flex gap-4",
                loadingIcon: "hidden",
                input:
                  "w-10/12 sm:text-md block rounded-md border border-zinc-300 bg-zinc-50 p-4 outline-brand outline-offset-2 text-zinc-900 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:ring-blue-500",
              }}
              submitIconComponent={() => <Search />}
              resetIconComponent={() => <X />}
            />

            <NoResultsBoundary fallback={<NoResults />}>
              <Hits
                hitComponent={Hit}
                classNames={{
                  list: "grid grid-cols-1 gap-4 sm:grid-cols-2",
                  item: "p-2 w-full border-b",
                }}
              />
              <div className="mt-4">
                <HitsPerPage />
              </div>
              <SearchPagination />
            </NoResultsBoundary>
          </div>
        </ScrollTo>
      </InstantSearch>
    </InstantSearchSSRProvider>
  )
}
