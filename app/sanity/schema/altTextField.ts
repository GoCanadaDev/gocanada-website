import { defineField, type ValidationContext } from "sanity"

import {
  type ImageWithAlt,
  isMissingAlt,
  missingAltSeverity,
} from "~/lib/imageAlt"

// Flags a missing alt at `severity`. Sanity can't set a custom rule's level
// from inside it, so the field runs one rule per level and each only fires
// for its own.
const missingAltAt =
  (severity: "error" | "warning") =>
  (alt: string | undefined, context: ValidationContext) =>
    isMissingAlt({ ...(context.parent as ImageWithAlt), alt }) &&
    missingAltSeverity(context.document?._createdAt) === severity
      ? "Alt text is required"
      : true

// Add to an image's `fields` to require alt text before publishing. Only
// blocks publishing: existing documents without alt text still render, and
// documents created before ALT_TEXT_REQUIRED_FROM only get a warning.
export const altTextField = defineField({
  name: "alt",
  type: "string",
  title: "Alt text",
  description:
    "Describe the image for people using screen readers. Required to publish.",
  validation: (Rule) => [
    Rule.custom(missingAltAt("error")),
    Rule.custom(missingAltAt("warning")).warning(),
  ],
})
