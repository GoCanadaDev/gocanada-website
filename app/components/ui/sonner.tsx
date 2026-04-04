import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster"
      toastOptions={{
        classNames: {
          actionButton: "!bg-brand !hover:bg-brandHover",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
