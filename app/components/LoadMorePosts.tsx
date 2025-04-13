import { client } from "~/sanity/client"
import { loadMorePostsQuery } from "~/sanity/queries/posts"
import { PostPreview } from "~/sanity/queries"
import { Button } from "./ui/button"
import { CardGrid } from "./CardGrid"
import { useState } from "react"

type LoadMorePostsProps = {
  lastPostId?: string
  lastPostPublishedAt?: string
  language: string
  onPostsLoaded: (posts: PostPreview[]) => void
  currentCount: number
  totalCount: number
}

export const LoadMorePosts = ({
  lastPostId,
  lastPostPublishedAt,
  language,
  onPostsLoaded,
  currentCount,
  totalCount,
}: LoadMorePostsProps) => {
  const [isLoading, setIsLoading] = useState(false)

  // Don't render if we've reached the end
  if (currentCount >= totalCount) {
    return null
  }

  const handleLoadMore = async () => {
    setIsLoading(true)
    try {
      const result = await client.fetch(loadMorePostsQuery, {
        language,
        lastId: lastPostPublishedAt || "",
      })
      if (result) {
        onPostsLoaded(result)
      }
    } catch (error) {
      console.error("Error loading more posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <Button
        onClick={handleLoadMore}
        disabled={isLoading}
        className="w-full max-w-xs"
      >
        {isLoading ? "Loading..." : "Load More Posts"}
      </Button>
    </div>
  )
}
