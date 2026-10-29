import { defineType } from "sanity"

import HorizontalRule from "~/components/portable/HorizontalRule"
import { asPreviewComponent } from "~/sanity/components/asPreviewComponent"

export const horizontalRuleType = defineType({
  name: "horizontalRuleType",
  title: "Horizontal Rule",
  type: "object",
  fields: [
    {
      name: "style",
      type: "string",
      options: {
        list: ["divider"],
        default: "divider",
      },
    },
  ],
  components: {
    preview: asPreviewComponent(HorizontalRule),
  },
})
