import { defineField, defineType } from "sanity"
import InstagramEmbed from "~/components/portable/InstagramEmbed"

export const instagramPostType = defineType({
  name: "instagramPostType",
  title: "Instagram Post",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description: "Visit an Instagram post in a browser and copy the URL.",
    }),
  ],
  components: {
    preview: InstagramEmbed,
  },
  preview: {
    select: { url: "url" },
  },
})
