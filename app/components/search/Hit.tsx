import type { Hit as AlgoliaHit } from "instantsearch.js"
import { SupportedLanguages } from "~/i18n"
import { Highlight } from "react-instantsearch"
import { MoveRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { LocalizedString } from "~/sanity/queries/shared"
import { useTranslate } from "~/lib/useTranslate"
import { AlgoliaPost } from "~/sanity/queries"
import { AspectRatio } from "~/components/ui/aspect-ratio"
import { Image } from "~/components/Image"
import { Typography } from "~/components/Typography"

type HitProps = {
  hit: AlgoliaHit<{
    slug: LocalizedString
    mainImage: {
      id: string
      preview: string
    }
    title: LocalizedString
    excerpt: LocalizedString
    category: LocalizedString
  }>
}

export const Hit = ({ hit }: HitProps) => {
  const {
    i18n: { language },
  } = useTranslation()
  const currentLang = language as SupportedLanguages
  const { translate, ready } = useTranslate()

  return (
    <article className="">
      <a
        href={`/${currentLang}/${hit.slug[currentLang]}`}
        className="flex gap-4"
      >
        <div className="w-32 flex-shrink-0">
          <AspectRatio
            ratio={3 / 2}
            className="w-32 overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800"
          >
            <Image
              mode="cover"
              id={hit.mainImage.id ?? ""}
              alt=""
              width={120}
              preview={hit.mainImage.preview ?? ""}
              loading="eager"
              className="w-32"
            />
          </AspectRatio>
        </div>
        <div className="space-y-2">
          <Typography.H4>
            <Highlight
              hit={hit}
              attribute={`category.title.${currentLang}` as keyof AlgoliaPost}
            />
          </Typography.H4>
          <Typography.H3 className="text-lg">
            <Highlight
              hit={hit}
              attribute={`title.${currentLang}` as keyof AlgoliaPost}
            />
          </Typography.H3>
          <Typography.TextMuted>
            <Highlight
              hit={hit}
              attribute={`excerpt.${currentLang}` as keyof AlgoliaPost}
            />
          </Typography.TextMuted>
          <Typography.TextMuted>
            {ready ? translate("readMore") : null}{" "}
            <MoveRight className="inline h-4 w-4" />
          </Typography.TextMuted>
        </div>
      </a>
    </article>
  )
}
