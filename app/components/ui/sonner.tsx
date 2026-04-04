import { useTheme } from "next-themes"
import { useLayoutEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const SONNER_HOST_ID = "sonner-host"

/** Instagram / Facebook in-app browsers often break `position:fixed` for nodes under `<body>`. */
const defaultMobileOffset = {
  bottom: "max(16px, env(safe-area-inset-bottom, 0px))",
} satisfies NonNullable<ToasterProps["mobileOffset"]>

const baseToastOptions: NonNullable<ToasterProps["toastOptions"]> = {
  classNames: {
    toast:
      "group toast group-[.toaster]:bg-white group-[.toaster]:text-zinc-950 group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-zinc-950 dark:group-[.toaster]:text-zinc-50 dark:group-[.toaster]:border-zinc-800",
    description:
      "group-[.toast]:text-zinc-500 dark:text-zinc-400 dark:group-[.toast]:text-zinc-400",
    actionButton:
      "group-[.toast]:bg-zinc-900 group-[.toast]:text-zinc-50 dark:group-[.toast]:bg-zinc-50 dark:group-[.toast]:text-zinc-900",
    cancelButton:
      "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-500 dark:text-zinc-400 dark:group-[.toast]:bg-zinc-800 dark:group-[.toast]:text-zinc-400",
  },
}

const Toaster = ({
  mobileOffset,
  toastOptions,
  ...props
}: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useLayoutEffect(() => {
    let el = document.getElementById(SONNER_HOST_ID)
    if (!el) {
      el = document.createElement("div")
      el.id = SONNER_HOST_ID
      document.documentElement.appendChild(el)
    }
    setContainer(el)
    // Do not remove the host on unmount: React Strict Mode remounts would tear
    // down Sonner between the cookie toast timeout and a second subscribe.
  }, [])

  if (!container) {
    return null
  }

  return createPortal(
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      mobileOffset={mobileOffset ?? defaultMobileOffset}
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
    container,
  )
}

export { Toaster }
