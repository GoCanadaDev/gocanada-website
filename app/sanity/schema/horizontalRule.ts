import { defineField, defineType } from "sanity"
import HorizontalRule from "~/components/portable/HorizontalRule"

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
      },
    },
  ],
  components: {
    preview: HorizontalRule,
  },
})
