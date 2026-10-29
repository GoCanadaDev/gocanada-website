import { describe, expect, it } from "vitest"

import { detectAiSource } from "./aiReferral"

const url = "https://gocanada.com/en/some-post"

describe("detectAiSource", () => {
  it("identifies a visit referred by ChatGPT", () => {
    expect(detectAiSource({ referrer: "https://chatgpt.com/", url })).toBe(
      "ChatGPT"
    )
  })

  it("matches subdomains of a known assistant host", () => {
    expect(
      detectAiSource({ referrer: "https://www.perplexity.ai/search/abc", url })
    ).toBe("Perplexity")
  })

  it.each([
    "https://www.google.com/",
    "https://notchatgpt.com/",
    "https://gocanada.com/en",
    "",
    "not a url",
  ])("does not tag a visit from referrer %j", (referrer) => {
    expect(detectAiSource({ referrer, url })).toBeNull()
  })

  it.each([
    ["chatgpt.com", "ChatGPT"],
    ["ChatGPT.com", "ChatGPT"],
    ["perplexity", "Perplexity"],
  ])("identifies the assistant from utm_source=%s", (utmSource, expected) => {
    expect(
      detectAiSource({
        referrer: "",
        url: `https://gocanada.com/en/some-post?utm_source=${utmSource}`,
      })
    ).toBe(expected)
  })

  it("does not tag a visit with a non-AI utm_source", () => {
    expect(
      detectAiSource({
        referrer: "",
        url: "https://gocanada.com/en/some-post?utm_source=newsletter",
      })
    ).toBeNull()
  })
})
