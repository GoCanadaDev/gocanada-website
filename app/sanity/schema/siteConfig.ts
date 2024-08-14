import { defineField, defineType } from "sanity"
import { Cog } from "lucide-react"

export const siteConfigType = defineType({
  name: "siteConfigType",
  title: "Site Config",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title",
      description:
        "This is the title that will be displayed in the browser tab and for SEO purposes.",
      type: "string",
    }),
    {
      name: "siteDescription",
      type: "text",
      title: "Site Description",
      description:
        "Describe your blog for search engines and social media, ideally less than 160 characters.",
    },
    {
      name: "keywords",
      type: "array",
      title: "Keywords",
      description: "Add keywords that describes your blog.",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    },
    defineField({
      name: "enablePartners",
      title: "Show/Hide Partners",
      type: "boolean",
    }),
    defineField({
      name: "footerText",
      title: "Footer text",
      type: "text",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Configuration",
        subtitle: "Only create one of these!",
        media: Cog,
      }
    },
  },
})
