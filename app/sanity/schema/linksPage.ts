import { Cog } from "lucide-react"
import { defineField, defineType } from "sanity"

export const linksPageType = defineType({
  name: "linksPageType",
  title: "Links Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Links Page Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "leadIn",
      title: "Links Page Lead In",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headerImage",
      title: "Links Page Logo",
      type: "image",
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Link Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "Link URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "withImage",
              title: "Link With Image?",
              type: "boolean",
            }),
            defineField({
              name: "image",
              title: "Link Image",
              type: "image",
              validation: (rule) =>
                rule.custom((_, context) => {
                  const isWithImage = context?.document?.withImage
                  if (isWithImage) {
                    return "An image is required if the link is set to Link With Image above."
                  }

                  return true
                }),
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Link In Bio Page",
        subtitle: "Only create one of these!",
        media: Cog,
      }
    },
  },
})
