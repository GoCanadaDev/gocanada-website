import { Resvg } from "@resvg/resvg-js"
import type { SanityDocument } from "@sanity/client"
import urlBuilder from "@sanity/image-url"
import type { SatoriOptions } from "satori"
import satori from "satori"

import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "~/routes/resource.og"
import { dataset, projectId } from "~/sanity/projectDetails"

// Load the font from the "public" directory
const fontSerif = (baseUrl: string) =>
  fetch(new URL(`${baseUrl}/fonts/Rasa-Regular.ttf`)).then((res) =>
    res.arrayBuffer()
  )
const fontSans = (baseUrl: string) =>
  fetch(new URL(`${baseUrl}/fonts/PTSans-Regular.ttf`)).then((res) =>
    res.arrayBuffer()
  )

export async function generatePngFromDocument(
  doc: SanityDocument,
  origin: string
) {
  const { title, mainImage, author } = doc

  // Prepare font data and settings for Satori
  const fontSerifData = await fontSerif(origin)
  const fontSansData = await fontSans(origin)
  const options: SatoriOptions = {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    fonts: [
      {
        name: "Rasa",
        data: fontSerifData,
        style: "normal",
      },
      {
        name: "PT Sans",
        data: fontSansData,
        style: "normal",
      },
    ],
  }

  // Create the SVG with satori
  const svg = await satori(
    <div
      style={{
        width: 1200,
        height: 630,
        background: "#bf2327",
        color: "white",
        fontFamily: "Rasa",
        letterSpacing: "-0.05em",
        display: "flex",
        lineHeight: 1,
      }}
    >
      <div
        style={{
          width: 600,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: (OG_IMAGE_HEIGHT - 500) / 2,
          gap: 25,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 50, marginBottom: 25 }}>{title.en}</div>
          <p
            style={{
              fontSize: 20,
              fontFamily: "'PT Sans', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
            }}
          >
            By {author.name}
          </p>
        </div>
        <img
          src="https://gocanada.com/images/logotype-white.png"
          width={300}
          height={59}
        />
      </div>
      {mainImage?.asset?._ref ? (
        <div
          style={{
            width: 600,
            height: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            overflow: "hidden",
          }}
        >
          <img
            alt=""
            src={urlBuilder({ projectId, dataset })
              // @ts-ignore
              .image(mainImage.asset._ref)
              .height(800)
              .width(800)
              .fit("max")
              .auto("format")
              .url()}
            width="600"
            height="500"
          />
        </div>
      ) : null}
    </div>,
    options
  )

  // Convert to PNG with resvg
  const resvg = new Resvg(svg)
  const pngData = resvg.render()
  return pngData.asPng()
}
