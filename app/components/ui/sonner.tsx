import { useTheme } from "next-themes"
import { useLayoutEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const SONNER_HOST_ID = "sonner-host"

/**
 * Narrow portal host under `<html>` (not `body`) for in-app WebViews.
 * Do not use `inset: 0` here — a full-screen fixed wrapper nests Sonner’s own
 * `position: fixed` toaster and breaks `%` widths + close-button positioning on mobile.
 */
function applySonnerHostStyles(el: HTMLElement) {
  el.setAttribute("data-sonner-host", "")
  Object.assign(el.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "0",
    overflow: "visible",
    zIndex: "2147483647",
    pointerEvents: "none",
  })
}

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
  position = "bottom-right",
  mobileOffset,
  toastOptions,
  style,
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
    applySonnerHostStyles(el)
    setContainer(el)
  }, [])

  if (!container) {
    return null
  }

  return createPortal(
    <Sonner
      position={position}
      theme={theme as ToasterProps["theme"]}
      className="toaster"
      style={{ pointerEvents: "auto", ...style }}
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
    container,
  )
}

export { Toaster }
