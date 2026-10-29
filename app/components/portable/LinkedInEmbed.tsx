import type { LinkedInEmbedProps } from "react-social-media-embed"
import { LinkedInEmbed as LinkedInEmbedComponent } from "react-social-media-embed"

const LinkedInEmbed = ({ url, ...rest }: LinkedInEmbedProps) => {
  if (!url) {
    return null
  }
  return <LinkedInEmbedComponent url={url} {...rest} />
}

export default LinkedInEmbed
