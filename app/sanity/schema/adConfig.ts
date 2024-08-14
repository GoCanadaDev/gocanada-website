import { defineType } from "sanity"
import { Megaphone } from "lucide-react"

export const adConfigType = defineType({
  name: "adConfigType",
  title: "Ad Config",
  type: "document",
  fields: [
    {
      name: "featuredAdsEnabled",
      title: "Enable Featured Ads",
      type: "boolean",
      description: "Enable or disable the featured ads section",
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
