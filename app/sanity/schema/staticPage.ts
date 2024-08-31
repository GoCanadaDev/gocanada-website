import { defineField, defineType } from "sanity"

export const staticPageType = defineType({
  name: "staticPageType",
  title: "Static Page",
  type: "document",
  description:
    "Create a new document for every static page in the footer. Note that we will make a new file in the code for these to work when adding any new pages.",
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
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
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
      name: "mainImageGradientOverlay",
      title: "Gradient Overlay on Main Image & Title",
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
