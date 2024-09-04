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
        "font-body prose-a: prose prose-zinc mx-0 my-12 max-w-none dark:prose-invert prose-h1:font-serif prose-h1:font-normal prose-h2:mb-4 prose-h2:mt-4 prose-h2:font-sans prose-h2:font-bold prose-h3:mb-4 prose-h3:mt-4 prose-h3:font-sans prose-h3:font-bold prose-h4:font-sans prose-h4:font-normal prose-p:mb-4 prose-p:mt-0 prose-p:text-zinc-800 prose-a:border-b prose-a:border-b-current prose-a:font-bold prose-a:text-brand prose-a:no-underline hover:prose-a:text-brandHover prose-figure:m-0 prose-figcaption:mb-4 prose-figcaption:mt-2 prose-figcaption:font-sans prose-figcaption:text-sm prose-ol:my-0 prose-ul:my-0 prose-li:my-0 prose-img:m-0 lg:leading-8",
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
