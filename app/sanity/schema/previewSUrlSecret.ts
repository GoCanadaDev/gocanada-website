export default {
  name: "sanity.previewUrlSecret",
  title: "Preview URL Secret",
  type: "document",
  // Hide from the regular document structure
  __experimental_exclude_from_search: true,
  // Prevent access from regular users
  __experimental_readonly: true,
  fields: [
    {
      name: "secret",
      type: "string",
      readOnly: true,
    },
    {
      name: "studioUrl",
      type: "string",
      readOnly: true,
    },
  ],
}
