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
      name: "title",
      title: "Title",
      type: "string",
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
      type: "localeText",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      description: "Instagram username, without the @",
      type: "string",
    }),
    defineField({
      name: "threads",
      title: "Threads",
      description: "Threads username, without the @",
      type: "string",
    }),
    defineField({
      name: "twitter",
      title: "Twitter",
      description: "Twitter username, without the @",
      type: "string",
    }),
    defineField({
      name: "youtube",
      title: "YouTube",
      description: "YouTube channel URL",
      type: "url",
    }),
    defineField({
      name: "facebook",
      title: "Facebook",
      description: "Facebook page URL",
      type: "url",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
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
