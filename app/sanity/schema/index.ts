import { authorType } from "~/sanity/schema/author"
import { blockContentType } from "~/sanity/schema/blockContent"
import { categoryType } from "~/sanity/schema/category"
import { homeType } from "~/sanity/schema/homeType"
import { localeSlug } from "./localeSlug"
import { localeString } from "./localeString"
import { localeText } from "./localeText"
import { postType } from "~/sanity/schema/post"
import { tagType } from "~/sanity/schema/tag"

export default [
  authorType,
  blockContentType,
  categoryType,
  homeType,
  localeSlug,
  localeString,
  localeText,
  postType,
  tagType,
]
