import { defineField, defineType } from "sanity"
import { TwoUpImage } from "~/components/portable/TwoUpImage"

export const twoUpImageType = defineType({
  name: "twoUpImageType",
  title: "Two-up Image",
  type: "object",
  fields: [
    defineField({
      name: "imageOne",
      options: { hotspot: true },
      type: "image",
      title: "Image One",
    }),
    {
      name: "altOne",
      type: "string",
      title: "Alt text for Image One",
    },
    defineField({
      name: "imageTwo",
      options: { hotspot: true },
      type: "image",
      title: "Image Two",
    }),
    {
      name: "altTwo",
      type: "string",
      title: "Alt text for Image two",
    },
    {
      name: "caption",
      type: "string",
      title: "Caption",
    },
    {
      name: "attribution",
      type: "string",
      title: "Attribution Name",
    },
    {
      name: "attributionUrl",
      type: "url",
      title: "Attribution URL",
    },

    {
      name: "fullBleed",
      type: "boolean",
      title: "Full Bleed",
    },
  ],
  components: {
    preview: TwoUpImage,
  },
  preview: {
    select: { imageOne: "imageOne", imageTwo: "imageTwo" },
    prepare(selection) {
      return {
        title: "Two-up Image",
      }
    },
  },
})
