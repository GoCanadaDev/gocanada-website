import { useTheme } from "next-themes"
import { useLayoutEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const baseToastOptions: NonNullable<ToasterProps["toastOptions"]> = {
  classNames: {
    toast:
      "group toast !opacity-100 group-[.toaster]:!bg-white group-[.toaster]:text-zinc-950 group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:!bg-zinc-950 dark:group-[.toaster]:text-zinc-50 dark:group-[.toaster]:border-zinc-800",
    description:
      "group-[.toast]:text-zinc-500 dark:text-zinc-400 dark:group-[.toast]:text-zinc-400",
    actionButton:
      "group-[.toast]:bg-zinc-900 group-[.toast]:text-zinc-50 dark:group-[.toast]:bg-zinc-50 dark:group-[.toast]:text-zinc-900",
    cancelButton:
      "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-500 dark:text-zinc-400 dark:group-[.toast]:bg-zinc-800 dark:group-[.toast]:text-zinc-400",
  },
}

const Toaster = ({
  position = "bottom-right",
  mobileOffset,
  toastOptions,
  style,
  ...props
}: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return createPortal(
    <Sonner
      position={position}
      theme={theme as ToasterProps["theme"]}
      className="toaster"
      style={style}
      mobileOffset={mobileOffset}
      toastOptions={{
        ...baseToastOptions,
        ...toastOptions,
        classNames: {
          ...baseToastOptions.classNames,
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />,
    document.body
  )
}

export { Toaster }
