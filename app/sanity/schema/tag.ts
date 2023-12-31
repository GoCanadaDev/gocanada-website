import { defineField, defineType } from "sanity"
import { baseLanguage } from "~/sanity/schema/language"

export const tagType = defineType({
  name: "tagType",
  title: "Tag",
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
