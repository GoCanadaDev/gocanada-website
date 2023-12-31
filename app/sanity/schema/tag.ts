import { defineField, defineType } from "sanity"
import { baseLanguage } from "~/sanity/schema/language"

export const tagType = defineType({
  name: "tagType",
  title: "Tag",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "localeSlug",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeString",
    }),
  ],
  preview: {
    select: {
      title: `title.${baseLanguage.id}`,
    },
  },
})
