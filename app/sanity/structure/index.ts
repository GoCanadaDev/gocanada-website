import {
  Folder,
  Newspaper,
  UserCircle,
  StickyNote,
  FolderInput,
  HeartHandshake,
  Link,
  Cog,
  Megaphone,
  List,
  Eye,
  EyeOff,
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
      S.documentTypeListItem("postType").title("All Posts").icon(Newspaper),
      S.listItem()
        .title("Published Posts")
        .icon(Eye)
        .child(
          S.documentList()
            .title("Published Posts")
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
            .apiVersion("v2023-11-15")
            .filter('_type == "postType" && !(_id in path("drafts.**"))')
            .child((id) => S.document().schemaType("postType").documentId(id))
        ),
      S.listItem()
        .title("Unpublished Posts")
        .icon(EyeOff)
        .child(
          S.documentList()
            .title("Unpublished Posts")
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
            .apiVersion("v2023-11-15")
            .filter('_type == "postType" && (_id in path("drafts.**"))')
            .child((id) => S.document().schemaType("postType").documentId(id))
        ),
      S.divider(),
      S.documentTypeListItem("featuredPostsConfig")
        .title("Featured Posts Config")
        .icon(List),
      S.divider(),

      S.documentTypeListItem("authorType").title("Authors").icon(UserCircle),
      S.divider(),
      S.documentTypeListItem("categoryType").title("Categories").icon(Folder),
      S.divider(),
      S.documentTypeListItem("subCategoryType")
        .title("Sub Categories")
        .icon(FolderInput),
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
      S.divider(),
      S.documentTypeListItem("linksPageType")
        .title(`"Link in Bio" Links`)
        .icon(Link),
      S.divider(),
    ])

export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType, documentId }
) => {
  const OGPreviewView = S.view
    .component(OGPreview)
    .options({
      url: resolveOGUrl(documentId),
    })
    .title("OG Preview")

  switch (schemaType) {
    case `postType`:
      return S.document().views([S.view.form(), OGPreviewView])
    default:
      return S.document().views([S.view.form()])
  }
}
