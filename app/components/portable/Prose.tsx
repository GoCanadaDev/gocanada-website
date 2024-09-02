import { cn } from "~/lib/utils"

export default function Prose({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "font-body holy-grail prose prose-zinc mx-0 my-12 max-w-none lg:prose-lg dark:prose-invert prose-h1:font-serif prose-h1:font-normal prose-h2:mb-0 prose-h2:mt-8 prose-h2:font-sans prose-h2:font-normal prose-h3:font-sans prose-h3:font-normal prose-h4:font-sans prose-h4:font-normal prose-p:my-4 prose-p:text-zinc-800 prose-a:font-normal prose-a:text-brand hover:prose-a:text-brandHover prose-figure:m-0 prose-figcaption:mt-2 prose-figcaption:text-sm prose-ol:my-0 prose-ul:my-0 prose-li:my-0 prose-img:m-0 md:mx-4 lg:leading-8",
        className
      )}
    >
      {children}
    </div>
  )
}
