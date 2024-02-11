import { MoveRight, Search } from "lucide-react"
import { SupportedLanguages } from "~/i18n"
import { useTranslation } from "react-i18next"
import { algoliaSearchClient } from "~/algolia"
import { AlgoliaPost } from "~/sanity/queries"
import {
  Highlight,
  Hits,
  InstantSearch,
  PoweredBy,
  SearchBox,
} from "react-instantsearch"
import { Typography } from "~/components/Typography"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { ScrollArea } from "~/components/ui/scroll-area"
import { useTranslate } from "~/lib/useTranslate"
import { useRootLoaderData } from "~/lib/useRootLoaderData"

const HitComponent = ({ hit }: { hit: AlgoliaPost }) => {
  const {
    i18n: { language },
  } = useTranslation()
  const currentLang = language as SupportedLanguages
  const { translate } = useTranslate()

  return (
    <article>
      <a
        href={`/${currentLang}/${hit.slug[currentLang]}`}
        className="flex flex-col border-b p-2"
      >
        <Typography.H3 className="text-lg">
          <Highlight
            hit={hit}
            attribute={`title.${currentLang}` as keyof AlgoliaPost}
          />
        </Typography.H3>
        <Typography.TextMuted>
          <Highlight
            hit={hit}
            attribute={`excerpt.${currentLang}` as keyof AlgoliaPost}
          />
        </Typography.TextMuted>
        <Typography.TextMuted>
          {translate("readMore")} <MoveRight className="inline h-4 w-4" />
        </Typography.TextMuted>
      </a>
    </article>
  )
}

const SearchModal = () => {
  const { themePreference } = useRootLoaderData()
  const { translate } = useTranslate()
  return (
    <Dialog>
      <DialogTrigger>
        <Search className="inline" />
      </DialogTrigger>
      <DialogContent className="h-[50vh]">
        <DialogHeader>
          <DialogTitle>{translate("search")}</DialogTitle>

          <InstantSearch indexName="posts" searchClient={algoliaSearchClient}>
            <div>
              <SearchBox
                autoFocus
                classNames={{
                  submit: "hidden",
                  reset: "hidden",
                  input:
                    "sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500",
                }}
              />
            </div>
            <ScrollArea className="max-h-[calc(50vh-165px)]">
              <Hits hitComponent={HitComponent} />
            </ScrollArea>
            <div className="absolute bottom-4 right-4">
              <PoweredBy
                className="w-32"
                theme={themePreference === "dark" ? "dark" : "light"}
              />
            </div>
          </InstantSearch>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default SearchModal
