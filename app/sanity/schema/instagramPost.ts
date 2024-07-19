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
      description:
        "A few options: 1) Open a post and select … > Copy Link. 2) Open a post in a browser window and copy the URL from the address bar. The URL should be in the format: https://www.instagram.com/p/abc123xyzAB/ . 3) Open a post and select … > Embed > Copy embed code. Paste the embed code in a text editor, then locate the data-instgrm-permalink attribute and use that link.",
    }),
  ],
  components: {
    preview: InstagramEmbed,
  },
  preview: {
    select: { url: "url" },
  },
})
