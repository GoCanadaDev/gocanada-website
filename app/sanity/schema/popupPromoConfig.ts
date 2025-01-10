import { defineType } from "sanity"
import { AppWindow } from "lucide-react"

export const popupPromoConfigType = defineType({
  name: "popupPromoConfigType",
  title: "Popup Promo Config",
  type: "document",
  fields: [
    {
      name: "popupPromoEnabled",
      title: "Enable the Popup Promotion",
      type: "boolean",
      description: "Enable or disable the popup promo on the homepage",
    },
    {
      name: "popupImage",
      title: "Left side image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "popupTitle",
      title: "Popup Title",
      type: "string",
    },
    {
      name: "popupCopy",
      title: "Popup Copy",
      type: "blockContentType",
    },
    {
      name: "popupButtonText",
      title: "Button Text",
      type: "string",
    },
    {
      name: "popupButtonUrl",
      title: "Button URL",
      type: "url",
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Popup Promo Configuration",
        subtitle: "Only create one of these!",
        media: AppWindow,
      }
    },
  },
})
