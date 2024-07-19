import {
  LinkedInEmbed as LinkedInEmbedComponent,
  LinkedInEmbedProps,
} from "react-social-media-embed"

const LinkedInEmbed = ({ url, ...rest }: LinkedInEmbedProps) => {
  if (!url) {
    return null
  }
  return <LinkedInEmbedComponent url={url} {...rest} />
}

export default LinkedInEmbed
