import type { FacebookEmbedProps } from "react-social-media-embed"
import { FacebookEmbed as FacebookEmbedComponent } from "react-social-media-embed"

const FacebookEmbed = ({ url, ...rest }: FacebookEmbedProps) => {
  if (!url) {
    return null
  }
  return <FacebookEmbedComponent url={url} {...rest} />
}

export default FacebookEmbed
