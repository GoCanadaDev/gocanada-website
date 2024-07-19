import FacebookEmbed from "./portable/FacebookEmbed"
import InstagramEmbed from "./portable/InstagramEmbed"
import LinkedInEmbed from "./portable/LinkedInEmbed"
import PinterestEmbed from "./portable/PinterestEmbed"
import TikTokEmbed from "./portable/TikTokEmbed"
import XEmbed from "./portable/XEmbed"
import YouTubeEmbed from "./portable/YouTubeEmbed"
import {
  SingleImage,
  SingleImageProps,
} from "app/components/portable/GalleryImages/SingleImage"
import {
  TwoUpImage,
  TwoUpImageProps,
} from "app/components/portable/GalleryImages/TwoUpImage"
import GalleryImages, {
  GalleryImagesProps,
} from "~/components/portable/GalleryImages"

const PortableTextComponents = {
  types: {
    facebookPostType: ({ value }: { value: { url: string } }) => (
      <div className="flex justify-center">
        <FacebookEmbed url={value.url} className="w-full max-w-[540px]" />
      </div>
    ),
    instagramPostType: ({ value }: { value: { url: string } }) => (
      <div className="flex justify-center">
        <InstagramEmbed url={value.url} className="w-full max-w-[540px]" />
      </div>
    ),
    linkedinPostType: ({ value }: { value: { url: string } }) => (
      <div className="flex justify-center">
        <LinkedInEmbed url={value.url} className="w-full max-w-[540px]" />
      </div>
    ),
    pinterestPostType: ({ value }: { value: { url: string } }) => (
      <div className="flex justify-center">
        <PinterestEmbed url={value.url} className="w-full max-w-[540px]" />
      </div>
    ),
    tiktokPostType: ({ value }: { value: { url: string } }) => (
      <div className="flex justify-center">
        <TikTokEmbed url={value.url} className="w-full max-w-[540px]" />
      </div>
    ),
    twitterPostType: ({ value }: { value: { url: string } }) => (
      <div className="flex justify-center">
        <XEmbed url={value.url} className="w-full max-w-[540px]" />
      </div>
    ),
    youTubePostType: ({ value }: { value: { url: string } }) => (
      <div className="flex justify-center">
        <YouTubeEmbed url={value.url} className="w-full max-w-[540px]" />
      </div>
    ),
    image: ({ value }: SingleImageProps) => {
      return <SingleImage value={value} />
    },
    twoUpImageType: ({ value }: TwoUpImageProps) => {
      return <TwoUpImage value={value} />
    },
    galleryType: ({ value }: GalleryImagesProps) => {
      return <GalleryImages value={value} />
    },
  },
}

export default PortableTextComponents
