import {
  Folder,
  Newspaper,
  Tags,
  UserCircle,
  StickyNote,
  // FolderInput,
  HeartHandshake,
  Link,
  Cog,
  Megaphone,
  List,
} from "lucide-react"
import type {
  DefaultDocumentNodeResolver,
  StructureResolver,
} from "sanity/structure"

import OGPreview from "~/sanity/components/OGPreview"

import { resolveOGUrl } from "./resolveOGUrl"

export const structure: StructureResolver = (S) =>
  S.list()
    .id("root")
    .title("Content")
    .items([
      S.documentTypeListItem("postType").title("Posts").icon(Newspaper),
      S.divider(),
      S.documentTypeListItem("linksPageType")
        .title(`"Link in Bio" Links`)
        .icon(Link),
      S.divider(),
      S.documentTypeListItem("authorType").title("Authors").icon(UserCircle),
      S.divider(),
      S.documentTypeListItem("categoryType").title("Categories").icon(Folder),
      S.divider(),
      // S.documentTypeListItem("subCategoryType")
      //   .title("Sub Categories")
      //   .icon(FolderInput),
      // S.divider(),
      S.documentTypeListItem("tagType").title("Tags").icon(Tags),
      S.divider(),
      S.documentTypeListItem("staticPageType")
        .title("Static Pages")
        .icon(StickyNote),
      S.divider(),
      S.documentTypeListItem("partnerType")
        .title("Partners")
        .icon(HeartHandshake),
      S.divider(),
      S.documentTypeListItem("siteConfigType").title("Site Config").icon(Cog),
      S.divider(),
      S.documentTypeListItem("adConfigType").title("Ad Config").icon(Megaphone),
    ])

export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType, documentId }
) => {
  // const OGPreviewView = S.view
  //   .component(OGPreview)
  //   .options({
  //     url: resolveOGUrl(documentId),
  //   })
  //   .title("OG Preview")

  switch (schemaType) {
    // case `home`:
    //   return S.document().views([S.view.form()])
    // case `record`:
    //   return S.document().views([S.view.form(), OGPreviewView])
    default:
      return S.document().views([S.view.form()])
  }
}
