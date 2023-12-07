// /**
//  * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
//  */

// import { visionTool } from "@sanity/vision"
// import { defineConfig } from "sanity"
// import { deskTool } from "sanity/desk"
// import {
//   defineUrlResolver,
//   Iframe,
//   type IframeOptions,
// } from "sanity-plugin-iframe-pane"
// import { previewUrl } from "sanity-plugin-iframe-pane/preview-url"
// import { documentInternationalization } from "@sanity/document-internationalization"

// // see https://www.sanity.io/docs/api-versioning for how versioning works
// import {
//   apiVersion,
//   dataset,
//   previewSecretId,
//   projectId,
// } from "~/lib/sanity.api"
// import { schema } from "~/schemas"

// const iframeOptions = {
//   url: defineUrlResolver({
//     base: "/api/draft",
//     requiresSlug: ["post"],
//   }),
//   urlSecretId: previewSecretId,
//   reload: { button: true },
// } satisfies IframeOptions

// export default defineConfig({
//   basePath: "/studio",
//   name: "gocanada",
//   title: "Go Canada",
//   projectId,
//   dataset,
//   //edit schemas in './src/schemas'
//   schema,
//   plugins: [
//     deskTool({
//       // `defaultDocumentNode` is responsible for adding a “Preview” tab to the document pane
//       // You can add any React component to `S.view.component` and it will be rendered in the pane
//       // and have access to content in the form in real-time.
//       // It's part of the Studio's “Structure Builder API” and is documented here:
//       // https://www.sanity.io/docs/structure-builder-reference
//       defaultDocumentNode: (S) => {
//         return S.document().views([
//           // Default form view
//           S.view.form(),
//           // Preview
//           S.view.component(Iframe).options(iframeOptions).title("Preview"),
//         ])
//       },
//     }),
//     // Add the "Open preview" action
//     previewUrl({
//       base: "/api/draft",
//       requiresSlug: ["post"],
//       urlSecretId: previewSecretId,
//     }),
//     // Vision lets you query your content with GROQ in the studio
//     // https://www.sanity.io/docs/the-vision-plugin
//     visionTool({ defaultApiVersion: apiVersion }),
//     documentInternationalization({
//       // Required configuration
//       supportedLanguages: [
//         { id: "en", title: "English" },
//         { id: "fr", title: "French" },
//       ],
//       languageField: "language",
//       schemaTypes: ["post"],
//     }),
//   ],
// })

// import { presentationTool } from "@sanity/presentation"
// import { visionTool } from "@sanity/vision"
// import { defineConfig } from "sanity"
// import { deskTool } from "sanity/desk"
// // import { documentInternationalization } from "@sanity/document-internationalization"

// import { dataset, projectId } from "~/sanity/projectDetails"
// import schema from "~/sanity/schema"
// import { defaultDocumentNode, structure } from "~/sanity/structure"

// export const config = defineConfig({
//   projectId,
//   dataset,
//   name: "sanity-remix",
//   title: "Sanity Remix",
//   plugins: [
//     deskTool({ structure, defaultDocumentNode }),
//     presentationTool({
//       previewUrl: "http://localhost:3000",
//     }),
//     visionTool(),
//     // documentInternationalization({
//     //   // Required configuration
//     //   supportedLanguages: [
//     //     { id: "en", title: "English" },
//     //     { id: "fr", title: "French" },
//     //   ],
//     //   languageField: "language",
//     //   schemaTypes: ["post"],
//     // }),
//   ],
//   basePath: `/studio`,
//   schema: {
//     types: schema,
//   },
// })

import { presentationTool } from "@sanity/presentation"
import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"

import { dataset, projectId } from "~/sanity/projectDetails"
import schema from "~/sanity/schema"
import { defaultDocumentNode, structure } from "~/sanity/structure"

export const config = defineConfig({
  projectId,
  dataset,
  name: "sanity-remix",
  title: "Sanity Remix",
  plugins: [
    // deskTool({ structure, defaultDocumentNode }),
    // presentationTool({
    //   previewUrl: "http://localhost:3000",
    // }),
    // visionTool(),
  ],
  basePath: `/studio`,
  schema: {
    types: schema,
  },
})
