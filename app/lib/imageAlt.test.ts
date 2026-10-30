import { describe, expect, it } from "vitest"

import {
  findBlockImagesMissingAlt,
  findPostImagesMissingAlt,
  isMissingAlt,
  missingAltSeverity,
} from "./imageAlt"

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
      { location: "Main image", path: "mainImage", assetRef: "image-main" },
      {
        location: "Secondary image",
        path: "secondaryImage",
        assetRef: "image-second",
      },
    ])
  })

  it("reports inline and gallery images in the body and byline by block position", () => {
    expect(
      findPostImagesMissingAlt({
        mainImage: { asset: { _ref: "image-main" }, alt: "A lake" },
        body: [
          { _type: "block", _key: "b1" },
          {
            _type: "image",
            _key: "b2",
            asset: { _ref: "image-inline" },
            caption: "Sunrise on the lake",
          },
          {
            _type: "galleryType",
            _key: "b3",
            images: [
              { _key: "g1", asset: { _ref: "image-g1" }, alt: "A canoe" },
              { _key: "g2", asset: { _ref: "image-g2" } },
            ],
          },
          {
            _type: "inlineAdType",
            _key: "b4",
            adImage: { asset: { _ref: "image-ad" } },
          },
        ],
        byline: [
          { _type: "image", _key: "y1", asset: { _ref: "image-byline" } },
        ],
      })
    ).toEqual([
      {
        location: "Body block 2",
        path: 'body[_key=="b2"]',
        assetRef: "image-inline",
        caption: "Sunrise on the lake",
      },
      {
        location: "Body block 3, gallery image 2",
        path: 'body[_key=="b3"].images[_key=="g2"]',
        assetRef: "image-g2",
      },
      {
        location: "Byline block 1",
        path: 'byline[_key=="y1"]',
        assetRef: "image-byline",
      },
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

describe("findBlockImagesMissingAlt", () => {
  it("labels images in any block content field, e.g. a static page's French body", () => {
    expect(
      findBlockImagesMissingAlt("Body (FR)", "body.fr", [
        { _type: "block", _key: "b1" },
        {
          _type: "galleryType",
          _key: "b2",
          images: [{ _key: "g1", asset: { _ref: "image-g1" } }],
        },
      ])
    ).toEqual([
      {
        location: "Body (FR) block 2, gallery image 1",
        path: 'body.fr[_key=="b2"].images[_key=="g1"]',
        assetRef: "image-g1",
      },
    ])
  })
})

describe("missingAltSeverity", () => {
  it("only warns for documents created before alt text was required", () => {
    expect(missingAltSeverity("2024-05-01T12:00:00Z")).toBe("warning")
  })

  it("blocks publishing for documents created once alt text is required", () => {
    expect(missingAltSeverity("2026-10-29T00:00:00Z")).toBe("error")
    expect(missingAltSeverity("2027-01-15T09:30:00Z")).toBe("error")
  })

  it("blocks publishing for a new document that hasn't been saved yet", () => {
    expect(missingAltSeverity(undefined)).toBe("error")
  })
})

const text = (_key: string, value: string, style = "normal") => ({
  _type: "block",
  _key,
  style,
  children: [{ text: value }],
})

describe("surrounding text context", () => {
  it("gives a body image its section heading and the paragraphs on either side", () => {
    const [image] = findBlockImagesMissingAlt("Body", "body", [
      text("t1", "Banff is busy in summer."),
      text("h1", "4. Johnston Canyon", "h2"),
      text("t2", "A catwalk clings to the canyon wall."),
      { _type: "image", _key: "i1", asset: { _ref: "image-canyon" } },
      text("t3", "Go early to beat the crowds."),
    ])

    expect(image.context).toEqual({
      heading: "4. Johnston Canyon",
      before: "A catwalk clings to the canyon wall.",
      after: "Go early to beat the crowds.",
    })
  })

  it("doesn't borrow text from neighbouring sections, and shares it across a gallery", () => {
    const images = findBlockImagesMissingAlt("Body", "body", [
      text("t1", "Previous section's paragraph."),
      text("h1", "Peggy's Cove", "h2"),
      {
        _type: "galleryType",
        _key: "g1",
        images: [
          { _key: "a", asset: { _ref: "image-a" } },
          { _key: "b", asset: { _ref: "image-b" } },
        ],
      },
      text("h2", "Lunenburg", "h2"),
      text("t2", "Next section's paragraph."),
    ])

    expect(images.map(({ context }) => context)).toEqual([
      { heading: "Peggy's Cove" },
      { heading: "Peggy's Cove" },
    ])
  })

  it("trims long paragraphs to the part nearest the image", () => {
    const long = (word: string) => Array(200).fill(word).join(" ")
    const [image] = findBlockImagesMissingAlt("Body", "body", [
      text("t1", `${long("far")} closest-before`),
      { _type: "image", _key: "i1", asset: { _ref: "image-x" } },
      text("t2", `closest-after ${long("far")}`),
    ])

    expect(image.context?.before).toMatch(/^….* closest-before$/)
    expect(image.context?.after).toMatch(/^closest-after .*…$/)
    expect(image.context?.before?.length).toBeLessThanOrEqual(401)
    expect(image.context?.after?.length).toBeLessThanOrEqual(401)
  })
})
