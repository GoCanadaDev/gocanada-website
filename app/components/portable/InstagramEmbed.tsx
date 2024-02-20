import {
  InstagramEmbed as InstagramEmbedComponent,
  InstagramEmbedProps,
} from "react-social-media-embed"

const InstagramEmbed = ({ url, ...rest }: InstagramEmbedProps) => {
  if (!url) {
    return null
  }
  return <InstagramEmbedComponent url={url} {...rest} />
}

export default InstagramEmbed
