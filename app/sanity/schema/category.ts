import { defineField, defineType } from "sanity"
import { baseLanguage } from "~/sanity/schema/language"

export const categoryType = defineType({
  name: "categoryType",
  title: "Category",
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
