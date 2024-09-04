import type { Hit as AlgoliaHit } from "instantsearch.js"
import { SupportedLanguages } from "~/i18n"
import { Highlight } from "react-instantsearch"
import { useTranslation } from "react-i18next"
import { AspectRatio } from "~/components/ui/aspect-ratio"
import { Image } from "~/components/Image"
import { Typography } from "~/components/Typography"

type HitProps = {
  hit: AlgoliaHit<{
    slug: string
    mainImage: {
      id: string
      preview: string
    }
    title: string
    excerpt: string
    categories: {
      title: string
      slug: string
    }[]
  }>
}

export const Hit = ({ hit }: HitProps) => {
  const {
    i18n: { language },
  } = useTranslation()
  const currentLang = language as SupportedLanguages

  return (
    <article className="">
      <a href={`/${currentLang}/${hit.slug}`} className="flex gap-4">
        <div className="w-32 flex-shrink-0">
          <AspectRatio
            ratio={3 / 2}
            className="w-32 overflow-hidden bg-zinc-200 dark:bg-zinc-800"
          >
            <Image
              mode="cover"
              id={hit.mainImage.id ?? ""}
              alt=""
              width={120}
              preview={hit.mainImage.preview ?? ""}
              loading="eager"
              className="h-full w-full object-cover object-center"
            />
          </AspectRatio>
        </div>
        <div className="space-y-2">
          <Typography.H4 className="text-brand">
            {hit.categories[0].title}
          </Typography.H4>
          <Typography.H3 className="text-lg">
            <Highlight hit={hit} attribute="title" />
          </Typography.H3>
          <Typography.TextMuted className="line-clamp-5">
            <Highlight hit={hit} attribute="excerpt" />
          </Typography.TextMuted>
        </div>
      </a>
    </article>
  )
}
