import FacebookEmbed from "./FacebookEmbed"
import InstagramEmbed from "./InstagramEmbed"
import LinkedInEmbed from "./LinkedInEmbed"
import PinterestEmbed from "./PinterestEmbed"
import TikTokEmbed from "./TikTokEmbed"
import XEmbed from "./XEmbed"
import YouTubeEmbed from "./YouTubeEmbed"
import { SingleImage, SingleImageProps } from "./GalleryImages/SingleImage"
import GalleryImages, { GalleryImagesProps } from "./GalleryImages"
import HorizontalRule from "./HorizontalRule"
import { PortableTextReactComponents } from "@portabletext/react"
import InlineAd from "../InlineAd"
import SubscribeForm from "../SubscribeForm"

const PortableTextComponents = {
  marks: {
    link: ({
      value,
      children,
    }: {
      value: { href: string }
      children: string
    }) => {
      return (
        <a href={value.href} target="_blank" rel="noopener">
          {children}
        </a>
      )
    },
  },
  types: {
    subscribeFormType: ({ value }: { value: { trackingName: string } }) => (
      <div className="mb-8 border border-zinc-300 bg-zinc-100 p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <SubscribeForm pageLocation={value.trackingName} />
      </div>
    ),
    // TODO: fix type for inline ad
    inlineAdType: ({ value }: { value: any }) => <InlineAd value={value} />,
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
    galleryType: ({ value }: GalleryImagesProps) => {
      return <GalleryImages value={value} />
    },
    horizontalRuleType: ({ value }: { value: any }) => {
      return <HorizontalRule value={value} />
    },
  },
} as Partial<PortableTextReactComponents>

export default PortableTextComponents
