import { describe, expect, it } from "vitest"

import { findPostImagesMissingAlt, isMissingAlt } from "./imageAlt"

const asset = { _ref: "image-abc-100x100-jpg" }

describe("isMissingAlt", () => {
  it.each([undefined, "", "   "])(
    "flags an uploaded image with alt %j",
    (alt) => {
      expect(isMissingAlt({ asset, alt })).toBe(true)
    }
  )

  it("accepts an uploaded image with alt text", () => {
    expect(isMissingAlt({ asset, alt: "Moraine Lake at sunrise" })).toBe(false)
  })

  it("ignores an image field with nothing uploaded", () => {
    expect(isMissingAlt(undefined)).toBe(false)
    expect(isMissingAlt({ alt: undefined })).toBe(false)
  })
})

describe("findPostImagesMissingAlt", () => {
  it("reports the main and secondary images when they lack alt text", () => {
    expect(
      findPostImagesMissingAlt({
        mainImage: { asset: { _ref: "image-main" } },
        secondaryImage: { asset: { _ref: "image-second" }, alt: " " },
      })
    ).toEqual([
      { location: "Main image", assetRef: "image-main" },
      { location: "Secondary image", assetRef: "image-second" },
    ])
  })

  it("reports inline and gallery images in the body and byline by block position", () => {
    expect(
      findPostImagesMissingAlt({
        mainImage: { asset: { _ref: "image-main" }, alt: "A lake" },
        body: [
          { _type: "block" },
          { _type: "image", asset: { _ref: "image-inline" } },
          {
            _type: "galleryType",
            images: [
              { asset: { _ref: "image-g1" }, alt: "A canoe" },
              { asset: { _ref: "image-g2" } },
            ],
          },
          { _type: "inlineAdType", adImage: { asset: { _ref: "image-ad" } } },
        ],
        byline: [{ _type: "image", asset: { _ref: "image-byline" } }],
      })
    ).toEqual([
      { location: "Body block 2", assetRef: "image-inline" },
      { location: "Body block 3, gallery image 2", assetRef: "image-g2" },
      { location: "Byline block 1", assetRef: "image-byline" },
    ])
  })

  it("reports nothing for a post whose images all have alt text", () => {
    expect(
      findPostImagesMissingAlt({
        mainImage: { asset: { _ref: "image-main" }, alt: "A lake" },
        body: [{ _type: "galleryType" }],
      })
    ).toEqual([])
  })
})
