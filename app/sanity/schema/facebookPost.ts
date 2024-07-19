import { defineField, defineType } from "sanity"
import FacebookEmbed from "~/components/portable/FacebookEmbed"

export const facebookPostType = defineType({
  name: "facebookPostType",
  title: "Facebook Post",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description:
        "For the post you'd like to embed, select ⋯ > Embed > Advanced settings > Get Code, then use the cite link in the generated blockquote.",
    }),
  ],
  components: {
    preview: FacebookEmbed,
  },
  preview: {
    select: { url: "url" },
  },
})
