import { defineField, defineType } from "sanity"
import LinkedInEmbed from "~/components/portable/LinkedInEmbed"

export const linkedinPostType = defineType({
  name: "linkedinPostType",
  title: "LinkedIn Post",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description:
        "The url must be be retrieved from the 'Embed this post' option for the desired post. Use the src attribute of the iframe.",
    }),
  ],
  components: {
    preview: LinkedInEmbed,
  },
  preview: {
    select: { url: "url" },
  },
})
