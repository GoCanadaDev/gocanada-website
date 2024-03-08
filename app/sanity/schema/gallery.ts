import GalleryImages, {
  GalleryDisplay,
} from "~/components/portable/GalleryImages"

export const galleryType = {
  name: "galleryType",
  type: "object",
  title: "Gallery",
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
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
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
          { title: "In-line", value: GalleryDisplay.Inline },
          { title: "Two Up", value: GalleryDisplay.TwoUp },
          { title: "Grid", value: GalleryDisplay.Grid },
          { title: "Carousel", value: GalleryDisplay.Carousel },
        ],
        layout: "radio",
      },
    },
  ],
  components: {
    preview: GalleryImages,
  },
  preview: {
    select: {
      display: "display",
      images: "images",
    },
    prepare({ images, display }: { display: any; images: any }) {
      return {
        title: `A ${display} - ${Object.keys(images ?? {}).length} images`,
        value: {
          images: images,
          display: display,
        },
      }
    },
  },
}
