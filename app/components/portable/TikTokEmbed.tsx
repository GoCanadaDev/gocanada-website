import {
  TikTokEmbed as TikTokEmbedComponent,
  TikTokEmbedProps,
} from "react-social-media-embed"

const TikTokEmbed = ({ url, ...rest }: TikTokEmbedProps) => {
  if (!url) {
    return null
  }
  return <TikTokEmbedComponent url={url} {...rest} />
}

export default TikTokEmbed
