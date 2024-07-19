import {
  YouTubeEmbed as YoutubeEmbedComponent,
  YouTubeEmbedProps,
} from "react-social-media-embed"

const YouTubeEmbed = ({ url, ...rest }: YouTubeEmbedProps) => {
  if (!url) {
    return null
  }
  return <YoutubeEmbedComponent url={url} {...rest} />
}

export default YouTubeEmbed
