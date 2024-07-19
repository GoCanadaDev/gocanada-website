import {
  XEmbed as XEmbedComponent,
  XEmbedProps,
} from "react-social-media-embed"

const XEmbed = ({ url, ...rest }: XEmbedProps) => {
  if (!url) {
    return null
  }
  return <XEmbedComponent url={url} {...rest} />
}

export default XEmbed
