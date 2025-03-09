import { defineType } from "sanity"
import { Megaphone } from "lucide-react"

export const adConfigType = defineType({
  name: "adConfigType",
  title: "Ad Config",
  type: "document",
  groups: [
    {
      name: "topBannerGroup",
      title: "Top Banner Ad",
    },
    {
      name: "midBannerGroup",
      title: "Mid Banner Ad",
    },
    {
      name: "verticalBannerGroup",
      title: "Vertical Post Ad",
    },
  ],
  fields: [
    {
      name: "featuredAdsEnabled",
      title: "Enable Featured Ads",
      type: "boolean",
      description: "Enable or disable all the ads",
    },
    {
      name: "topBannerAdsCycleTime",
      title: "Top Banner Cycle Time",
      type: "number",
      description:
        "Time, in seconds, to cycle through the top banner ads, between 1 and 30",
      group: "topBannerGroup",
      initialValue: 10,
      validation: (Rule) => Rule.required().min(1).max(30),
    },
    {
      name: "topBannerAds",
      title: "Top Banner Ads",
      description:
        "Add your top banner ads to cycle through here, only one will be shown at a time.",
      type: "array",
      group: "topBannerGroup",
      of: [
        {
          name: "topBannerAd",
          type: "object",
          title: "Top Banner Ad",
          preview: {
            select: {
              title: "topBannerAdUrl",
              media: "topBannerAdImage",
            },
          },
          fields: [
            {
              name: "topBannerAdUrl",
              title: "Top Banner Ad Url",
              type: "url",
              description: "Paste your URL here",
            },
            {
              name: "topBannerAdImage",
              title: "Top Banner Ad Image",
              type: "image",
              options: {
                hotspot: true,
              },
              description:
                "Used in conjunction with the URL when you dont want to use the Code section below",
            },
            {
              name: "topBannerAdCode",
              title: "Top Banner Ad Code",
              type: "text",
              description: "Paste your HTML or script code here",
            },
            {
              name: "topBannerAdWidth",
              title: "Top Banner Ad Width",
              type: "number",
            },
            {
              name: "topBannerAdHeight",
              title: "Top Banner Ad Height",
              type: "number",
            },
          ],
        },
      ],
    },
    {
      name: "midBannerAdsCycleTime",
      title: "Midroll Banner Cycle Time",
      type: "number",
      description:
        "Time, in seconds, to cycle through the midroll banner ads, between 1 and 30",
      group: "midBannerGroup",
      initialValue: 10,
      validation: (Rule) => Rule.required().min(1).max(30),
    },
    {
      name: "midBannerAds",
      title: "mid Banner Ads",
      description:
        "Add your midroll banner ads to cycle through here, only one will be shown at a time.",
      type: "array",
      group: "midBannerGroup",
      of: [
        {
          name: "midBannerAd",
          type: "object",
          title: "mid Banner Ad",
          preview: {
            select: {
              title: "midBannerAdUrl",
              media: "midBannerAdImage",
            },
          },
          fields: [
            {
              name: "midBannerAdUrl",
              title: "Mid Banner Ad Url",
              type: "url",
              description: "Paste your URL here",
            },
            {
              name: "midBannerAdImage",
              title: "Mid Banner Ad Image",
              type: "image",
              options: {
                hotspot: true,
              },
              description:
                "Used in conjunction with the URL when you dont want to use the Code section below",
            },
            {
              name: "midBannerAdCode",
              title: "Mid Banner Ad Code",
              type: "text",
              description: "Paste your HTML or script code here",
            },
            {
              name: "midBannerAdWidth",
              title: "Mid Banner Ad Width",
              type: "number",
            },
            {
              name: "midBannerAdHeight",
              title: "Mid Banner Ad Height",
              type: "number",
            },
          ],
        },
      ],
    },
    {
      name: "verticalBannerAdsCycleTime",
      title: "Vertical Banner Cycle Time",
      type: "number",
      description:
        "Time, in seconds, to cycle through the vertical banner ads, between 1 and 30",
      group: "verticalBannerGroup",
      initialValue: 10,
      validation: (Rule) => Rule.required().min(1).max(30),
    },
    {
      name: "verticalBannerAds",
      title: "vertical Banner Ads",
      description:
        "Add your vertical banner ads to cycle through here, only one will be shown at a time.",
      type: "array",
      group: "verticalBannerGroup",
      of: [
        {
          name: "verticalBannerAd",
          type: "object",
          title: "vertical Banner Ad",
          preview: {
            select: {
              title: "verticalBannerAdUrl",
              media: "verticalBannerAdImage",
            },
          },
          fields: [
            {
              name: "verticalBannerAdUrl",
              title: "Vertical Post Ad Url",
              type: "url",
              description: "Paste your URL here",
            },
            {
              name: "verticalBannerAdImage",
              title: "Vertical Post Ad Image",
              type: "image",
              options: {
                hotspot: true,
              },
              description:
                "Used in conjunction with the URL when you dont want to use the Code section below",
            },
            {
              name: "verticalBannerAdCode",
              title: "Vertical Post Ad Code",
              type: "text",
              description: "Paste your HTML or script code here",
            },
            {
              name: "verticalBannerAdWidth",
              title: "Vertical Post Ad Width",
              type: "number",
            },
            {
              name: "verticalBannerAdHeight",
              title: "Vertical Post Ad Height",
              type: "number",
            },
          ],
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Ad Configuration",
        subtitle: "Only create one of these!",
        media: Megaphone,
      }
    },
  },
})
