import { defineType } from "sanity"
import { Megaphone } from "lucide-react"

export const featuredPostsConfig = defineType({
  name: "featuredPostsConfig",
  title: "Featured & Trending Posts Config",
  type: "document",
  fields: [
    {
      name: "featuredPosts",
      title: "6 Featured Posts, in order",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "postType" }],
        },
      ],
      validation: (Rule) => Rule.required().min(6).max(6),
    },
    {
      name: "trendingPosts",
      title: "3 Trending Posts, in order",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "postType" }],
        },
      ],
      validation: (Rule) => Rule.required().min(3).max(3),
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Featured & Trending Posts Configuration",
        subtitle: "Only create one of these!",
        media: Megaphone,
      }
    },
  },
})
