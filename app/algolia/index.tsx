import algoliasearch from "algoliasearch"
import {
  algoliaAdminApiKey,
  algoliaApplicationId,
  algoliaSearchApiKey,
} from "~/sanity/projectDetails"

export const algoliaAdminInstance = algoliasearch(
  algoliaApplicationId,
  algoliaAdminApiKey
)

const algoliaSearchInstance = algoliasearch(
  algoliaApplicationId,
  algoliaSearchApiKey
)

export const algoliaSearchClient = {
  search(requests: any): Readonly<Promise<any>> {
    if (requests.every(({ params }: any) => !params.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          processingTimeMS: 0,
        })),
      })
    }

    return algoliaSearchInstance.search(requests)
  },
}
