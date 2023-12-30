import { authorType } from "~/sanity/schema/author"
import { blockContentType } from "~/sanity/schema/blockContent"
import { categoryType } from "~/sanity/schema/category"
import { homeType } from "~/sanity/schema/homeType"
import { postType } from "~/sanity/schema/post"
import { tagType } from "~/sanity/schema/tag"
import { localeString } from "./localeString"
import { localeSlug } from "./localeSlug"

export default [
  authorType,
  blockContentType,
  categoryType,
  homeType,
  localeSlug,
  localeString,
  postType,
  tagType,
]
