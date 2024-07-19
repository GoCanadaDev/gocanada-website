import {
  FacebookEmbed as FacebookEmbedComponent,
  FacebookEmbedProps,
} from "react-social-media-embed"

const FacebookEmbed = ({ url, ...rest }: FacebookEmbedProps) => {
  if (!url) {
    return null
  }
  return <FacebookEmbedComponent url={url} {...rest} />
}

export default FacebookEmbed
