import { defineType } from "sanity"
import { InlineAdProps } from "~/components/InlineAd"

export const inlineAdType = defineType({
  name: "inlineAdType",
  title: "Inline Ad",
  type: "document",
  fields: [
    {
      name: "enabledUntil",
      title: "Enable Ad Until",
      type: "datetime",
      description: "Hide the ad after a certain date automatically",
    },
    {
      name: "adUrl",
      title: "Ad URL",
      type: "url",
      description: "Paste your URL here",
    },
    {
      name: "adImage",
      title: "Ad Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description:
        "Used in conjunction with the URL when you dont want to use the Code section below",
    },
    {
      name: "adCode",
      title: "Ad Code",
      type: "text",
      description: "Paste your HTML or script code here",
    },
    {
      name: "adWidth",
      title: "Ad Width",
      type: "number",
    },
    {
      name: "adHeight",
      title: "Ad Height",
      type: "number",
    },
  ],
  preview: {
    select: {
      adUrl: "adUrl",
      adImage: "adImage",
    },
    prepare({ adUrl, adImage }: InlineAdProps) {
      return {
        title: `Ad: ${adUrl}`,
        media: adImage,
      }
    },
  },
})
