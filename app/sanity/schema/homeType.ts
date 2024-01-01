import { Home } from "lucide-react"
import { defineField, defineType } from "sanity"

export const homeType = defineType({
  name: "home",
  title: "Home",
  type: "document",
  icon: Home,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "siteTitle",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      artist: "siteTitle",
    },
  },
})
