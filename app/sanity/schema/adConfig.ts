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
  ],
  fields: [
    {
      name: "featuredAdsEnabled",
      title: "Enable Featured Ads",
      type: "boolean",
      description: "Enable or disable the featured ads section",
    },
    {
      name: "topBannerAdUrl",
      title: "Top Banner Ad Url",
      type: "url",
      description: "Paste your URL here",
      group: "topBanner",
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
    },
    {
      name: "topBannerAdCode",
      title: "Top Banner Ad Code",
      type: "text",
      description: "Paste your HTML or script code here",
      group: "topBanner",
    },
    {
      name: "topBannerAdWidth",
      title: "Top Banner Ad Width",
      type: "number",
      group: "topBanner",
    },
    {
      name: "topBannerAdHeight",
      title: "Top Banner Ad Height",
      type: "number",
      group: "topBanner",
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
