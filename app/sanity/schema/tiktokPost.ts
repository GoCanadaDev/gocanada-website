import { defineField, defineType } from "sanity"
import TikTokEmbed from "~/components/portable/TikTokEmbed"

export const tiktokPostType = defineType({
  name: "tiktokPostType",
  title: "TikTok Post",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description:
        "Open a post in your browser. The post URL will be shown. Click the Copy Link button. The URL must contain the video ID, in the format https://www.tiktok.com/@username/video/1234567890123456789. Short links are not supported.",
    }),
  ],
  components: {
    preview: TikTokEmbed,
  },
  preview: {
    select: { url: "url" },
  },
})
