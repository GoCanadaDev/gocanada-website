import { defineField, defineType } from "sanity"

export const authorType = defineType({
  name: "authorType",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bio",
      type: "localeString",
    }),
  ],
  preview: {
    select: {
      title: "name",
      slug: "slug.current",
      media: "image",
    },
    prepare(selection) {
      const { slug, title } = selection
      return {
        ...selection,
        title,
        subtitle: slug,
      }
    },
  },
})
