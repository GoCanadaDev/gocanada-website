import InstagramEmbed from "./portable/InstagramEmbed"
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
    instagramPostType: ({ value }: { value: { url: string } }) => (
      <div className="flex justify-center">
        <InstagramEmbed url={value.url} className="w-full max-w-[540px]" />
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
