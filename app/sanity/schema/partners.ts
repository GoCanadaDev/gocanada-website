import groq from "groq"
import { ValidationContext, defineField, defineType } from "sanity"
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
    _type == 'partnerType' &&
    !(_id in [$draft, $published]) &&
    displayOrder == $number
  ][0]._id)`

  return await client.fetch(query, params)
}

export const partnerType = defineType({
  name: "partnerType",
  title: "Partner",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Partner Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Partner Logo",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "Partner Link",
      type: "url",
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
  ],
})
