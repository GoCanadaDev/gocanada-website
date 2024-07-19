import { defineField, defineType } from "sanity"
import PinterestEmbed from "~/components/portable/PinterestEmbed"

export const pinterestPostType = defineType({
  name: "pinterestPostType",
  title: "Pinterest Post",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description:
        "Visit a Pinterest post in your browser. Copy the URL from the address bar. The URL must contain the pin ID, in the format pin/1234567890123456789. Short links are not supported.",
    }),
  ],
  components: {
    preview: PinterestEmbed,
  },
  preview: {
    select: { url: "url" },
  },
})
