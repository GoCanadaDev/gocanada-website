import { presentationTool } from "@sanity/presentation"
import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import { media } from "sanity-plugin-media"

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
    // presentationTool({
    //   previewUrl: "http://localhost:3000",
    // }),
    visionTool(),
    media(),
  ],
  basePath: `/studio`,
  schema: {
    types: schema,
  },
})
