import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"
import { Typography } from "~/components/Typography"
import { ImageAsset } from "sanity"
import { urlForImage } from "~/lib/sanity.image"

type UserMediaObjectProps = {
  name: string
  image: ImageAsset
  content: React.ReactNode
  hoverCardContent?: React.ReactNode
}

export function UserMediaObject({
  name,
  image,
  content,
  hoverCardContent,
}: UserMediaObjectProps) {
  const renderAvatar = () => (
    <Avatar className="border">
      <AvatarImage src={urlForImage(image)?.width(96).height(96).url()} />
      <AvatarFallback>
        {
          // fake out initials by grabbing capitalized letters
          name
            .match(/(\b\S)?/g)!
            .join("")
            .toUpperCase()
        }
      </AvatarFallback>
    </Avatar>
  )
  return (
    <div className="mb-8 flex items-start">
      {hoverCardContent ? (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div>{renderAvatar()}</div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex space-x-4">
              {renderAvatar()}
              <div className="space-y-4">
                <Typography.H3>{name}</Typography.H3>
                {hoverCardContent}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ) : (
        renderAvatar()
      )}

      <div className="ml-4">{content}</div>
    </div>
  )
}

export default UserMediaObject
