import { authorType } from "~/sanity/schema/author"
import { blockContentType } from "~/sanity/schema/blockContent"
import { categoryType } from "~/sanity/schema/category"
import { instagramPostType } from "~/sanity/schema/instagramPost"
import { linksPageType } from "./linksPage"
import { localeBlockContentType } from "~/sanity/schema/localeBlockContent"
import { localeSlug } from "~/sanity/schema/localeSlug"
import { localeString } from "~/sanity/schema/localeString"
import { localeText } from "~/sanity/schema/localeText"
import { partnerType } from "~/sanity/schema/partners"
import { postType } from "~/sanity/schema/post"
import { staticPageType } from "~/sanity/schema/staticPage"
import { subCategoryType } from "~/sanity/schema/subCategory"
import { tagType } from "~/sanity/schema/tag"
import { twoUpImageType } from "~/sanity/schema/twoUpImage"

export default [
  authorType,
  blockContentType,
  categoryType,
  instagramPostType,
  linksPageType,
  localeBlockContentType,
  localeSlug,
  localeString,
  localeText,
  partnerType,
  postType,
  staticPageType,
  subCategoryType,
  tagType,
  twoUpImageType,
]
