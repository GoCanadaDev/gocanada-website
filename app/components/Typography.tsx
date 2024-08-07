import { HTMLProps } from "react"
import { cn } from "~/lib/utils"

type TypographyProps = {
  children: React.ReactNode
  className?: HTMLProps<HTMLElement>["className"]
}

const H1 = ({ children, className }: TypographyProps) => (
  <h1
    className={cn(
      "scroll-m-20 font-serif text-4xl font-extrabold tracking-tight lg:text-5xl",
      className
    )}
  >
    {children}
  </h1>
)

const H2 = ({ children, className }: TypographyProps) => (
  <h2
    className={cn(
      "scroll-m-20 border-b pb-2 font-serif text-3xl font-semibold tracking-tight first:mt-0",
      className
    )}
  >
    {children}
  </h2>
)

const H3 = ({ children, className }: TypographyProps) => (
  <h3
    className={cn(
      "scroll-m-20 font-serif text-2xl font-semibold tracking-tight",
      className
    )}
  >
    {children}
  </h3>
)

const H4 = ({ children, className }: TypographyProps) => (
  <h4
    className={cn(
      "scroll-m-20 font-sans text-xs font-light uppercase tracking-[6px]",
      className
    )}
  >
    {children}
  </h4>
)

const Paragraph = ({ children, className }: TypographyProps) => (
  <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
    {children}
  </p>
)

const Blockquote = ({ children, className }: TypographyProps) => (
  <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)}>
    {children}
  </blockquote>
)

const UL = ({ children, className }: TypographyProps) => (
  <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}>
    {children}
  </ul>
)

const InlineCode = ({ children, className }: TypographyProps) => (
  <code
    className={cn(
      "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      className
    )}
  >
    {children}
  </code>
)

const Lead = ({ children, className }: TypographyProps) => (
  <p className={cn("font-lead text-xl lg:text-2xl", className)}>{children}</p>
)

const TextLarge = ({ children, className }: TypographyProps) => (
  <p className={cn("text-lg font-semibold lg:text-xl", className)}>
    {children}
  </p>
)

const TextSmall = ({ children, className }: TypographyProps) => (
  <p className={cn("text-sm font-medium leading-none", className)}>
    {children}
  </p>
)

const TextMuted = ({ children, className }: TypographyProps) => (
  <p className={cn("text-sm text-slate-400", className)}>{children}</p>
)

export const Typography = ({ children }: TypographyProps) => children

Typography.H1 = H1
Typography.H2 = H2
Typography.H3 = H3
Typography.H4 = H4
Typography.Paragraph = Paragraph
Typography.Blockquote = Blockquote
Typography.UL = UL
Typography.InlineCode = InlineCode
Typography.Lead = Lead
Typography.TextLarge = TextLarge
Typography.TextSmall = TextSmall
Typography.TextMuted = TextMuted
