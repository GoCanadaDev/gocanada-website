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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "localeSlug",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "localeText",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "authorType" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "categoryType" } }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "subCategories",
      title: "Sub-Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "subCategoryType" } }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: { type: "tagType" } }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "showDate",
      title: "Show Date",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImageCaption",
      title: "Main Image Caption",
      type: "string",
    }),
    defineField({
      name: "mainImageAttribution",
      type: "string",
      title: "Attribution Name",
    }),
    defineField({
      name: "mainImageAttributionUrl",
      type: "url",
      title: "Attribution URL",
    }),
    defineField({
      name: "mainImageFullBleed",
      title: "Full Bleed Main Image & Title",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "isSponsored",
      title: "Sponsored Post",
      type: "boolean",
      description:
        "Check this box to enable/disable the sponsored post text below",
    }),
    defineField({
      name: "sponsoredText",
      title: "Sponsored Post Text",
      type: "string",
      description:
        "The text to display under the title if this post is sponsored",
    }),
    defineField({
      name: "byline",
      title: "Byline/Ad Disclosure",
      type: "blockContentType",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContentType",
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Published Date",
      name: "publishedAt",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
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
