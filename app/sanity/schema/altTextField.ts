import { defineField } from "sanity"

import { type ImageWithAlt, isMissingAlt } from "~/lib/imageAlt"

// Add to an image's `fields` to require alt text before publishing. Only
// blocks publishing: existing documents without alt text still render.
export const altTextField = defineField({
  name: "alt",
  type: "string",
  title: "Alt text",
  description:
    "Describe the image for people using screen readers. Required to publish.",
  validation: (Rule) =>
    Rule.custom((alt, context) =>
      isMissingAlt({ ...(context.parent as ImageWithAlt), alt })
        ? "Alt text is required"
        : true
    ),
})
