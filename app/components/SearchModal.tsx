import Modal from "~/components/Modal"
import { SupportedLanguages } from "~/i18n"
import { useTranslation } from "react-i18next"
import { algoliaSearchClient } from "~/algolia"
import { AlgoliaPost } from "~/sanity/queries"
import { Hits, InstantSearch, SearchBox, PoweredBy } from "react-instantsearch"
import { Typography } from "~/components/Typography"

type Props = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const HitComponent = ({ hit }: { hit: AlgoliaPost }) => {
  const {
    i18n: { language },
  } = useTranslation()
  const currentLang = language as SupportedLanguages

  return (
    <a
      href={`/${currentLang}/${hit.slug[currentLang]}`}
      className="text-xl font-semibold text-gray-900 dark:text-white"
    >
      <div className="flex flex-col p-2">
        <Typography.H4>{hit.title[currentLang]}</Typography.H4>
        <Typography.TextMuted>{hit.excerpt[currentLang]}</Typography.TextMuted>
      </div>
    </a>
  )
}

const SearchModal = ({ isOpen, setIsOpen }: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={
        <div>
          <Typography.H1>Search</Typography.H1>
          <PoweredBy className="h-2" />
        </div>
      }
    >
      <InstantSearch indexName="posts" searchClient={algoliaSearchClient}>
        <div className="p-3">
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

        <Hits
          hitComponent={HitComponent}
          className="!mt-0 max-h-80 overflow-y-auto overflow-x-hidden"
        />
      </InstantSearch>
    </Modal>
  )
}

export default SearchModal
