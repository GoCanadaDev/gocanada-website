import { presentationTool } from "@sanity/presentation"
import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import { documentInternationalization } from "@sanity/document-internationalization"

import { dataset, projectId } from "~/sanity/projectDetails"
import schema from "~/sanity/schema"
import { defaultDocumentNode, structure } from "~/sanity/structure"

export const config = defineConfig({
  projectId,
  dataset,
  name: "go-canada",
  title: "GoCanada",
  plugins: [
    deskTool({ structure, defaultDocumentNode }),
    presentationTool({
      previewUrl: "http://localhost:3000",
    }),
    visionTool(),
    documentInternationalization({
      // Required configuration
      supportedLanguages: [
        { id: "en", title: "English" },
        { id: "fr", title: "French" },
      ],
      languageField: "language",
      schemaTypes: ["postType"],
    }),
  ],
  basePath: `/studio`,
  schema: {
    types: schema,
  },
})
