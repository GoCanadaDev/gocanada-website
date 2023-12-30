import { defineField, defineType } from "sanity"

export const postType = defineType({
  name: "postType",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Post Title",
      type: "localeString",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "localeSlug",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "authorType" },
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: { type: "categoryType" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: { type: "tagType" } }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContentType",
    }),
  ],

  preview: {
    select: {
      title: "title.en",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection
      return {
        ...selection,
        subtitle: `by ${author}`,
      }
    },
  },
})
