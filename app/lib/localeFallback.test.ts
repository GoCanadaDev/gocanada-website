import { describe, expect, it } from "vitest"

import { withEnglishFallback } from "./localeFallback"

describe("withEnglishFallback", () => {
  it("uses the English value when the French one is missing", () => {
    expect(
      withEnglishFallback({ title: { en: "Banff in winter", fr: null } })
    ).toEqual({ title: { en: "Banff in winter", fr: "Banff in winter" } })
  })

  it.each(["", "   "])("treats a blank French value %j as missing", (fr) => {
    expect(withEnglishFallback({ excerpt: { en: "A road trip", fr } })).toEqual(
      { excerpt: { en: "A road trip", fr: "A road trip" } }
    )
  })

  it("fills French values inside lists, like a post's sub-categories", () => {
    expect(
      withEnglishFallback({
        subCategories: [
          { title: { en: "Hiking", fr: "Randonnée" } },
          { title: { en: "Road Trips" } },
        ],
      })
    ).toEqual({
      subCategories: [
        { title: { en: "Hiking", fr: "Randonnée" } },
        { title: { en: "Road Trips", fr: "Road Trips" } },
      ],
    })
  })
})
