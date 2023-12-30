import { defineType } from "sanity"
import { supportedLanguages } from "~/sanity/schema/language"

export const localeText = defineType({
  title: "Localized text",
  name: "localeText",
  type: "object",
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: "text",
    rows: 4,
  })),
})
