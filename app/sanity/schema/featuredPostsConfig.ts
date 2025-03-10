import { defineType } from "sanity"
import { Megaphone } from "lucide-react"

export const featuredPostsConfig = defineType({
  name: "featuredPostsConfig",
  title: "Featured & Trending Posts Config",
  type: "document",
  fields: [
    {
      name: "mainPostCarouselCycleTime",
      title: "Main Post Carousel Cycle Time",
      type: "number",
      description:
        "Time, in seconds, to cycle through the main posts, between 1 and 30",
      initialValue: 10,
      validation: (Rule) => Rule.required().min(1).max(30),
    },
    {
      name: "frontAndCenterPosts",
      title: "Front & Center Post(s), in a carousel or by itself if only 1",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "postType" }],
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(3),
    },
    {
      name: "featuredPosts",
      title:
        "5 Featured Posts, in order, do go around the Front & Center post(s)",
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
    {
      name: "spotlightPost",
      title: "Text-based spotlight at top of page",
      type: "object",
      fields: [
        {
          name: "text",
          title: "Spotlight Text",
          type: "string",
          description:
            "This is the text that will be displayed in the spotlight",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "link",
          title: "Spotlight Link",
          type: "reference",
          to: [{ type: "postType" }],
          validation: (Rule) => Rule.required(),
        },
      ],
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
