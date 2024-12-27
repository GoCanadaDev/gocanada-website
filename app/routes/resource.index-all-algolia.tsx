import { client } from "~/sanity/client"
import { json } from "react-router"
import type { ActionFunction } from "react-router"

import { getAlgoliaPosts } from "~/sanity/queries"
import { algoliaAdminInstance } from "~/algolia"

function extractKeywords(text: string) {
  // Define a list of common stop words to remove
  const stopWords = new Set([
    "the",
    "and",
    "a",
    "an",
    "is",
    "in",
    "it",
    "of",
    "on",
    "for",
    "to",
    "with",
    "by",
    "that",
    "this",
    "was",
    "were",
    "are",
    "be",
    "or",
    "as",
    "at",
    "but",
    "from",
    "which",
    "when",
    "where",
    "how",
    "why",
    "all",
    "any",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "so",
    "than",
    "too",
    "very",
    "can",
    "will",
    "just",
    "don't",
    "should",
    "now",
  ])

  // Convert text to lowercase and split it into words
  const words = text.toLowerCase().match(/\b\w+\b/g)

  // Use a Set to keep track of unique keywords
  const uniqueKeywords = new Set()

  // Iterate through words and filter out stop words and duplicates
  words?.forEach((word: string) => {
    if (!stopWords.has(word)) {
      uniqueKeywords.add(word)
    }
  })

  // Convert the Set back to a string
  return Array.from(uniqueKeywords).join(" ")
}

export const action: ActionFunction = async ({ request }) => {
  const posts = await getAlgoliaPosts(client)
  const index = algoliaAdminInstance.initIndex("posts")

  const mappedPosts = posts.map((post) => ({
    ...post,
    body: extractKeywords(post.body.toString()),
  }))

  try {
    console.time(`Saving ${posts.length} posts to index:`)
    await index.saveObjects(mappedPosts)
    console.timeEnd(`Saved ${posts.length} posts to index:`)

    return json(
      { success: true },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    )
  } catch (error) {
    console.error(error)

    return json(
      { success: false },
      {
        status: 200,
      }
    )
  }
}
