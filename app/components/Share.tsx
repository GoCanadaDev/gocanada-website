import { Link } from "lucide-react"
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share"
import { toast } from "sonner"
import { dataset, projectId } from "~/sanity/projectDetails"
const baseImageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/`

type ShareProps = {
  url: string
  title: string
  tags: string[]
  media: string
  description: string
}

export default function Share({
  url,
  title,
  tags,
  media,
  description,
}: ShareProps) {
  // TODO: update URL to production URL
  const shareUrl = `https://gocanada-website.netlify.app${url}`

  const hashtags =
    (tags && tags.length > 0 && tags.map((tag) => tag.split(" ").join(""))) ||
    []

  const copy = () => {
    navigator.clipboard.writeText(shareUrl)
    toast.success("Link copied to clipboard!")
  }

  return (
    <div className="mt-2 flex justify-center gap-1">
      <FacebookShareButton
        url={shareUrl}
        hashtag={tags && tags.length > 0 ? hashtags[0] : undefined}
        className="hover:opacity-90"
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton
        url={shareUrl}
        title={title}
        hashtags={tags && tags.length > 0 ? hashtags : undefined}
        className="hover:opacity-90"
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>{" "}
      <TelegramShareButton
        url={shareUrl}
        title={title}
        className="hover:opacity-90"
      >
        <TelegramIcon size={32} round />
      </TelegramShareButton>
      <RedditShareButton
        url={shareUrl}
        title={title}
        className="hover:opacity-90"
      >
        <RedditIcon size={32} round bgStyle={{ fill: "#FF4500" }} />
      </RedditShareButton>
      <PinterestShareButton
        url={shareUrl}
        media={`${baseImageUrl}${media
          .replace("image-", "")
          .replace("-jpg", ".jpg")}`}
        description={description}
        className="hover:opacity-90"
      >
        <PinterestIcon size={32} round />
      </PinterestShareButton>
      <EmailShareButton
        url={shareUrl}
        subject={`Check out this article on Go Canada: ${title}`}
        body="Hey, I thought you might be interested in this article on Go Canada that I found!"
        className="hover:opacity-90"
      >
        <EmailIcon size={32} round />
      </EmailShareButton>
      <div
        className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-brand hover:bg-brandHover"
        onClick={() => copy()}
      >
        <Link className="text-white" size={16} />
      </div>
    </div>
  )
}
