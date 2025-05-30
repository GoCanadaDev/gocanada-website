import { presentationTool } from "@sanity/presentation"
import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { media } from "sanity-plugin-media"
import { dataset, projectId } from "~/sanity/projectDetails"
import schema from "~/sanity/schema"
import { structureTool } from "sanity/structure"
import { defaultDocumentNode, structure } from "~/sanity/structure"
import { debugSecrets } from "@sanity/preview-url-secret/sanity-plugin-debug-secrets"

export const config = defineConfig({
  projectId,
  dataset,
  name: "go-canada",
  title: "Go Canada",
  plugins: [
    debugSecrets(),
    structureTool({ structure, defaultDocumentNode }),
    presentationTool({
      previewUrl: {
        draftMode: {
          enable: "/api/draft",
        },
      },
    }),
    visionTool(),
    media(),
  ],
  basePath: `/studio`,
  schema: {
    types: schema,
  },
})
