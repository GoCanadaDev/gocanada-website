import { defineType } from "sanity";
import { supportedLanguages } from "~/sanity/schema/language";

export const localeBlockContentType = defineType({
  title: "Localized Block Content",
  name: "localeBlockContentType",
  type: "object",
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: "blockContentType",
  })),
})
