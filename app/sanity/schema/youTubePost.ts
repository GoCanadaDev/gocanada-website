import { defineField, defineType } from "sanity"
import YouTubeEmbed from "~/components/portable/YouTubeEmbed"

export const youTubePostType = defineType({
  name: "youTubePostType",
  title: "YouTube Post",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description:
        "Open the video in a browser window. Copy the URL from the address bar. You can also click Share > Copy.",
    }),
  ],
  components: {
    preview: YouTubeEmbed,
  },
  preview: {
    select: { url: "url" },
  },
})
