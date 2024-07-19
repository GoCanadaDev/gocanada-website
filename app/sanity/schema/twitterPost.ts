import { defineField, defineType } from "sanity"
import XEmbed from "~/components/portable/XEmbed"

export const twitterPostType = defineType({
  name: "twitterPostType",
  title: "X (Twitter) Post",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description:
        "Open an X post in a browser window. Copy the link to the post from the address bar. The URL must contain the post ID, in the format https://twitter.com/username/status/1234567890123456789. Short links are not supported.",
    }),
  ],
  components: {
    preview: XEmbed,
  },
  preview: {
    select: { url: "url" },
  },
})
