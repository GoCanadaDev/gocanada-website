export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="holy-grail prose prose-lg prose-slate mx-4 my-12 max-w-none lg:prose-xl dark:prose-invert prose-h1:font-serif prose-h1:font-normal prose-h2:mb-0 prose-h2:font-serif prose-h2:font-normal prose-h3:font-serif prose-h3:font-normal prose-p:my-4 prose-a:text-brand hover:prose-a:text-brandHover prose-figure:my-4 prose-figcaption:mt-2 prose-figcaption:text-sm prose-ol:my-0 prose-ul:my-0 prose-li:my-0">
      {children}
    </div>
  )
}
