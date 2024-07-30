import groq from "groq"
import { ValidationContext, defineField, defineType } from "sanity"
import { baseLanguage } from "~/sanity/schema/language"
import { client } from "~/sanity/client"

const isUniqueNumber = async (number: number, context: ValidationContext) => {
  const { document } = context

  const id = document?._id.replace(/^drafts\./, "")

  const params = {
    draft: `drafts.${id}`,
    published: id,
    number,
  }

  const query = groq`!defined(*[
    _type == 'categoryType' &&
    !(_id in [$draft, $published]) &&
    displayOrder == $number
  ][0]._id)`

  return await client.fetch(query, params)
}

export const categoryType = defineType({
  name: "categoryType",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "localeSlug",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      validation: (Rule) => [
        Rule.custom(async (value, context) => {
          const isUnique = await isUniqueNumber(Number(value), context)
          if (!isUnique) {
            return "Display order is not unique, choose a different number"
          }
          return true
        }),
        Rule.required()
          .positive()
          .error("Display order should be a positive number"),
      ],
    }),
    defineField({
      name: "subCategories",
      title: "Sub Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "subCategoryType" } }],
    }),
    defineField({
      name: "relatedTags",
      title: "Related Tags",
      type: "array",
      of: [{ type: "reference", to: { type: "tagType" } }],
    }),
    defineField({
      name: "enabled",
      title: "Enabled in Navigation",
      description:
        "Enable or disable this category to control whether or not it appears in the navigation",
      type: "boolean",
    }),
  ],
  preview: {
    select: {
      title: `title.${baseLanguage.id}`,
    },
  },
})
