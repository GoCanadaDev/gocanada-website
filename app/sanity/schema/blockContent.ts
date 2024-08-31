import {
  FacebookIcon,
  ImagePlusIcon,
  InstagramIcon,
  LinkedinIcon,
  Megaphone,
  Minus,
  Music2,
  PinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react"
import { defineType, defineArrayMember } from "sanity"

import { SingleImage } from "~/components/portable/GalleryImages/SingleImage"

export const blockContentType = defineType({
  title: "Block Content",
  name: "blockContentType",
  type: "array",
  of: [
    defineArrayMember({
      title: "Block",
      type: "block",
      // Marks let you mark up inline text in the block editor.
      marks: {
        // // Decorators usually describe a single property – e.g. a typographic
        // // preference or highlighting by editors.
        // decorators: [
        //   { title: "Strong", value: "strong" },
        //   { title: "Emphasis", value: "em" },
        //   { title: "Code", value: "code" },
        // ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "galleryType",
      icon: ImagePlusIcon,
    }),
    defineArrayMember({
      type: "facebookPostType",
      icon: FacebookIcon,
    }),
    defineArrayMember({
      type: "instagramPostType",
      icon: InstagramIcon,
    }),
    defineArrayMember({
      type: "linkedinPostType",
      icon: LinkedinIcon,
    }),
    defineArrayMember({
      type: "pinterestPostType",
      icon: PinIcon,
    }),
    defineArrayMember({
      type: "tiktokPostType",
      icon: Music2,
    }),
    defineArrayMember({
      type: "twitterPostType",
      icon: TwitterIcon,
    }),
    defineArrayMember({
      type: "youTubePostType",
      icon: YoutubeIcon,
    }),
    defineArrayMember({
      type: "horizontalRuleType",
      icon: Minus,
    }),
    defineArrayMember({
      type: "inlineAdType",
      icon: Megaphone,
    }),
  ],
})
