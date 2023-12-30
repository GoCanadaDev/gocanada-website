import { defineType } from "sanity"
import { supportedLanguages } from "~/sanity/schema/language"

export const localeSlug = defineType({
  name: "localeSlug",
  title: "Locale Slug",
  type: "object",
  // Dynamically define one field per language
  fields: supportedLanguages.map((lang) => ({
    name: lang.id,
    title: lang.title,
    type: "slug",
    options: {
      source: `title.${[lang.id]}`,
      maxLength: 96,
      // slugify: (input: string) =>
      //   input
      //     .normalize("NFKD") // split accented characters into their base characters and diacritical marks
      //     .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      //     .trim() // trim leading or trailing whitespace
      //     .toLowerCase() // convert to lowercase
      //     .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
      //     .replace(/\s+/g, "-") // replace spaces with hyphens
      //     .replace(/-+/g, "-"), // remove consecutive hyphens,
    },
  })),
})
