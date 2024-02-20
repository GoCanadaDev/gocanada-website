import InstagramEmbed from "./portable/InstagramEmbed"
import { SingleImage, SingleImageProps } from "./portable/SingleImage"
import { TwoUpImage, TwoUpImageProps } from "./portable/TwoUpImage"

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
  },

  // marks: {
  //   link: ({ children, value }) => {
  //     const rel = !value.href.startsWith("/")
  //       ? "noreferrer noopener"
  //       : undefined
  //     return (
  //       <a href={value.href} rel={rel}>
  //         {children}
  //       </a>
  //     )
  //   },
  // },
}

export default PortableTextComponents
