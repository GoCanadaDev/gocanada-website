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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      type: "localeString",
      validation: (Rule) => Rule.required(),
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
