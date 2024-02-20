import { defineField, defineType } from "sanity"
import { baseLanguage } from "~/sanity/schema/language"

export const subCategoryType = defineType({
  name: "subCategoryType",
  title: "Sub Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "localeSlug",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeString",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: `title.${baseLanguage.id}`,
    },
  },
})
