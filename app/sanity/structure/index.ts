import { Folder, Home, Newspaper, Tags, UserCircle } from "lucide-react"
import type {
  DefaultDocumentNodeResolver,
  StructureResolver,
} from "sanity/desk"

import OGPreview from "~/sanity/components/OGPreview"

import { resolveOGUrl } from "./resolveOGUrl"

export const structure: StructureResolver = (S) =>
  S.list()
    .id("root")
    .title("Content")
    .items([
      // Singleton, home page curation
      S.documentListItem()
        .schemaType("home")
        .icon(Home)
        .id("home")
        .title("Home"),
      S.divider(),
      // Document lists
      S.documentTypeListItem("postType").title("Posts").icon(Newspaper),
      S.divider(),
      S.documentTypeListItem("authorType").title("Authors").icon(UserCircle),
      S.divider(),
      S.documentTypeListItem("categoryType").title("Categories").icon(Folder),
      S.divider(),
      S.documentTypeListItem("tagType").title("Tags").icon(Tags),
      S.divider(),
      S.documentTypeListItem("staticPageType").title("Static Pages").icon(Folder),
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
    case `home`:
      return S.document().views([S.view.form()])
    case `record`:
      return S.document().views([S.view.form(), OGPreviewView])
    default:
      return S.document().views([S.view.form()])
  }
}
