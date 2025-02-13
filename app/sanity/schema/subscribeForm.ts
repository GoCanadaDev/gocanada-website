import { defineField, defineType } from "sanity"
import SubscribeForm from "~/components/SubscribeForm"

export const subscribeFormType = defineType({
  name: "subscribeFormType",
  title: "Newsletter Subscription Form",
  type: "document",
  fields: [
    defineField({
      name: "trackingName",
      title: "shorthand name for the post for tracking purposes",
      type: "string",
    }),
  ],
  components: {
    preview: SubscribeForm,
  },
})
