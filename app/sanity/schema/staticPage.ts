import { defineField, defineType } from "sanity"

export const staticPageType = defineType({
  name: "staticPageType",
  title: "Static Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Static Page Heading",
      type: "localeString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "route",
      title: "Route",
      type: "string",
      validation: (Rule) => Rule.required().regex(/^\/.*/),
    }),
    defineField({
      name: "isFooterLink",
      title: "Show Link in Footer",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "localeBlockContentType",
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "title.en",
      body: "body",
    },
  },
})
