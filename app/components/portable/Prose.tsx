import { cn } from "~/lib/utils"

export default function Prose({
  children,
  className,
  disableHolyGrail,
}: {
  children: React.ReactNode
  className?: string
  disableHolyGrail?: boolean
}) {
  return (
    <div
      className={cn(
        "prose prose-zinc",
        "prose-h1:font-serif prose-h1:font-normal",
        "prose-h2:mb-4 prose-h2:mt-4 prose-h2:font-sans prose-h2:font-bold",
        "prose-h3:mb-4 prose-h3:mt-4 prose-h3:font-sans prose-h3:font-bold",
        "prose-h4:font-sans prose-h4:font-normal",
        "prose-p:mb-4 prose-p:mt-0 prose-p:text-zinc-800",
        "prose-ol:my-0 prose-ul:my-0 prose-li:my-0 prose-img:m-0",
        "prose-a:border-b prose-a:border-b-current prose-a:font-bold prose-a:text-brand prose-a:no-underline hover:prose-a:text-brandHover",
        "prose-figure:m-0 prose-figcaption:mb-4 prose-figcaption:mt-2 prose-figcaption:font-sans prose-figcaption:text-sm",
        "mx-0 my-12 max-w-none font-body lg:leading-8",
        "dark:prose-h2:text-zinc-100 dark:prose-h3:text-zinc-100 dark:prose-p:text-zinc-200 dark:prose-a:text-brand dark:prose-blockquote:text-zinc-200 dark:prose-strong:text-inherit dark:prose-li:text-zinc-200",
        {
          "holy-grail md:mx-4": !disableHolyGrail,
        },
        className
      )}
    >
      {children}
    </div>
  )
}
