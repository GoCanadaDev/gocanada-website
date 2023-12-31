import { defineField, defineType } from "sanity"
import { baseLanguage } from "~/sanity/schema/language"

export const categoryType = defineType({
  name: "categoryType",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "localeString",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeString",
    }),
  ],
  preview: {
    select: {
      title: `name.${baseLanguage.id}`,
    },
  },
})
