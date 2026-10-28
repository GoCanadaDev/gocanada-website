import type { PinterestEmbedProps } from "react-social-media-embed"
import { PinterestEmbed as PinterestEmbedComponent } from "react-social-media-embed"

const PinterestEmbed = ({ url, ...rest }: PinterestEmbedProps) => {
  if (!url) {
    return null
  }
  return <PinterestEmbedComponent url={url} {...rest} />
}

export default PinterestEmbed
