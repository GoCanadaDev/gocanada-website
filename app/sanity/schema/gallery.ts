import { defineType } from "sanity"

import GalleryImages, {
  GalleryDisplay,
} from "~/components/portable/GalleryImages"
import { asPreviewComponent } from "~/sanity/components/asPreviewComponent"
import { altTextField } from "~/sanity/schema/altTextField"

export const galleryType = defineType({
  name: "galleryType",
  type: "object",
  title: "Image(s)",
  fields: [
    {
      name: "images",
      type: "array",
      title: "Images",
      of: [
        {
          name: "image",
          type: "image",
          title: "Image",
          options: {
            hotspot: true,
          },
          fields: [
            altTextField,
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
            {
              name: "attribution",
              type: "string",
              title: "Attribution Name",
            },
            {
              name: "attributionUrl",
              type: "url",
              title: "Attribution URL",
            },
            {
              name: "fullBleed",
              type: "boolean",
              title: "Full Bleed",
            },
          ],
        },
      ],
    },
    {
      name: "display",
      type: "string",
      title: "Display as",
      description: "How should we display these images?",
      options: {
        list: [
          { title: "Single", value: GalleryDisplay.Single },
          { title: "In-line (2+ in a row)", value: GalleryDisplay.Inline },
          { title: "Two Up (Square Aspect)", value: GalleryDisplay.TwoUp },
          { title: "Grid (Square Aspect)", value: GalleryDisplay.Grid },
          { title: "Carousel", value: GalleryDisplay.Carousel },
        ],
        layout: "radio",
      },
    },
  ],
  components: {
    preview: asPreviewComponent(GalleryImages),
  },
  preview: {
    select: {
      display: "display",
      images: "images",
    },
    prepare({ images, display }) {
      return {
        title: `A ${display} - ${Object.keys(images ?? {}).length} images`,
        value: {
          images: images,
          display: display,
        },
      }
    },
  },
})
