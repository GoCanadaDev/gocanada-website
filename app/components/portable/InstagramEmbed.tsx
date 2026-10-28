import type { InstagramEmbedProps } from "react-social-media-embed"
import { InstagramEmbed as InstagramEmbedComponent } from "react-social-media-embed"

const InstagramEmbed = ({ url, ...rest }: InstagramEmbedProps) => {
  if (!url) {
    return null
  }
  return <InstagramEmbedComponent url={url} {...rest} />
}

export default InstagramEmbed
