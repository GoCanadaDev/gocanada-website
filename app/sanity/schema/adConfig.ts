import { defineType } from "sanity"
import { Megaphone } from "lucide-react"

export const adConfigType = defineType({
  name: "adConfigType",
  title: "Ad Config",
  type: "document",
  groups: [
    {
      name: "topBanner",
      title: "Top Banner Ad",
    },
    {
      name: "midRollAd",
      title: "Mid Banner Ad",
    },
    {
      name: "verticalPostAd",
      title: "Vertical Post Ad",
    },
  ],
  fields: [
    {
      name: "featuredAdsEnabled",
      title: "Enable Featured Ads",
      type: "boolean",
      description: "Enable or disable the featured ads section",
    },
    {
      name: "topBannerAdsCycleTime",
      title: "Top Banner Cycle Time",
      type: "number",
      description:
        "Time, in seconds, to cycle through the top banner ads, between 1 and 30",
      group: "topBanner",
      initialValue: 10,
      validation: (Rule) => Rule.required().min(1).max(30),
    },
    {
      name: "topBannerAds",
      title: "Top Banner Ads",
      description:
        "Add your top banner ads to cycle through here, only one will be shown at a time.",
      type: "array",
      group: "topBanner",
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
      name: "topBannerAdUrl",
      title: "Top Banner Ad Url",
      type: "url",
      description: "Paste your URL here",
      group: "topBanner",
      hidden: true,
    },
    {
      name: "topBannerAdImage",
      title: "Top Banner Ad Image",
      type: "image",
      group: "topBanner",
      options: {
        hotspot: true,
      },
      description:
        "Used in conjunction with the URL when you dont want to use the Code section below",
      hidden: true,
    },
    {
      name: "topBannerAdCode",
      title: "Top Banner Ad Code",
      type: "text",
      description: "Paste your HTML or script code here",
      group: "topBanner",
      hidden: true,
    },
    {
      name: "topBannerAdWidth",
      title: "Top Banner Ad Width",
      type: "number",
      group: "topBanner",
      hidden: true,
    },
    {
      name: "topBannerAdHeight",
      title: "Top Banner Ad Height",
      type: "number",
      group: "topBanner",
      hidden: true,
    },
    {
      name: "midBannerAdUrl",
      title: "Mid Banner Ad Url",
      type: "url",
      description: "Paste your URL here",
      group: "midRollAd",
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
      group: "midRollAd",
    },
    {
      name: "midBannerAdCode",
      title: "Mid Banner Ad Code",
      type: "text",
      description: "Paste your HTML or script code here",
      group: "midRollAd",
    },
    {
      name: "midBannerAdWidth",
      title: "Mid Banner Ad Width",
      type: "number",
      group: "midRollAd",
    },
    {
      name: "midBannerAdHeight",
      title: "Mid Banner Ad Height",
      type: "number",
      group: "midRollAd",
    },
    {
      name: "verticalPostAdUrl",
      title: "Vertical Post Ad Url",
      type: "url",
      description: "Paste your URL here",
      group: "verticalPostAd",
    },
    {
      name: "verticalPostAdImage",
      title: "Vertical Post Ad Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description:
        "Used in conjunction with the URL when you dont want to use the Code section below",
      group: "verticalPostAd",
    },
    {
      name: "verticalPostAdCode",
      title: "Vertical Post Ad Code",
      type: "text",
      description: "Paste your HTML or script code here",
      group: "verticalPostAd",
    },
    {
      name: "verticalPostAdWidth",
      title: "Vertical Post Ad Width",
      type: "number",
      group: "verticalPostAd",
    },
    {
      name: "verticalPostAdHeight",
      title: "Vertical Post Ad Height",
      type: "number",
      group: "verticalPostAd",
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
