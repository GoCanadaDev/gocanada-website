import { defineType } from "sanity"
import { supportedLanguages } from "~/sanity/schema/language"

export const localeString = defineType({
  title: "Localized string",
  name: "localeString",
  type: "object",
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: "string",
  })),
})
