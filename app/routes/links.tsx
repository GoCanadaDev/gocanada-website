import type { LoaderFunction, MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { client } from "~/sanity/client"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { Image } from "~/components/Image"
import { SITE_META } from "~/lib/utils"
import { LinksPageType, getLinks } from "~/sanity/queries/links"
import { urlForImage } from "~/lib/sanity.image"
import { Avatar, AvatarImage } from "~/components/ui/avatar"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: LoaderDataType
}) => {
  const title = [
    data?.linksPageData?.title,
    data?.linksPageData?.leadIn,
    SITE_META.siteTitle,
  ]
    .filter(Boolean)
    .join(" | ")

  return [
    { title },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:title", content: title },
    { property: "og:title", content: title },
  ]
}

type LoaderDataType = {
  linksPageData: LinksPageType
}

export const loader: LoaderFunction = async () => {
  const linksPageData = await getLinks(client)

  return json({
    linksPageData,
  })
}

export default function Links() {
  const { linksPageData } = useLoaderData() as LoaderDataType

  return (
    <Layout>
      <article className="text-center">
        <div className="holy-grail mx-4 my-24 max-w-none text-xl">
          <Avatar className="mx-auto mb-4 size-24">
            <AvatarImage
              src={urlForImage(linksPageData.headerImage)
                ?.width(192)
                .height(192)
                .url()}
            />
          </Avatar>
          <Typography.H2>{linksPageData.title}</Typography.H2>
          <Typography.H4 className="my-4">{linksPageData.leadIn}</Typography.H4>

          <section className="space-y-4 py-8">
            {linksPageData.links
              .filter((link) => !link.withImage)
              .map((link) => (
                <div key={link.title}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener"
                    className="block rounded-md border-2 border-zinc-200 p-4 text-center transition-transform hover:scale-[1.05] dark:border-zinc-100"
                  >
                    {link.title}
                  </a>
                </div>
              ))}
          </section>
          <section className="grid grid-cols-2 gap-1 md:grid-cols-3">
            {linksPageData.links
              .filter((link) => link.withImage)
              .map((link) => (
                <div key={link.title}>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    <Image
                      mode="cover"
                      id={link.image.id}
                      alt={`Read more: ${link.title}`}
                      width={500}
                      preview={link.image.preview ?? ""}
                      loading="eager"
                      className="transition-transform hover:scale-[1.02]"
                      aria-label={`Read more: ${link.title}`}
                    />
                  </a>
                </div>
              ))}
          </section>
        </div>
      </article>
    </Layout>
  )
}
