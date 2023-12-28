import { SanityImage } from "sanity-image"

import { dataset, projectId } from "~/sanity/projectDetails"
import { Typography } from "./Typography"
const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/`

type HeroImageProps = {
  id: string
  title: string
}

// radial-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0))

export const HeroImage = ({ id, title }: HeroImageProps) => (
  <section className="relative h-screen">
    <SanityImage
      id={id}
      baseUrl={baseUrl}
      width={1440}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        userSelect: "none",
        zIndex: 1,
      }}
      alt=""
    />
    <div
      style={{
        backgroundImage:
          "radial-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0))",
        position: "absolute",
        inset: 0,
        zIndex: 2,
      }}
    />
    <div className="relative z-[3] flex h-screen items-center justify-center">
      <Typography.H1 className="text-white drop-shadow-lg">
        {title}
      </Typography.H1>
    </div>
  </section>
)
