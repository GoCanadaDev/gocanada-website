import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "~/components/ui/dialog"
import { PopupPromoConfig } from "~/sanity/queries/popupPromoConfig"
import { Image } from "./Image"
import PortableTextComponents from "./portable"
import Prose from "./portable/Prose"
import { PortableText } from "@portabletext/react"
import { Typography } from "./Typography"

export default function PromoPopup({ config }: { config: PopupPromoConfig }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // get value from sessionStorage
    const hasSeenPromoPopup = sessionStorage.getItem("hasSeenPromoPopup")

    if (!hasSeenPromoPopup) {
      setTimeout(() => {
        setIsOpen(true)
      }, 1000)
    }
  }, [])

  const setSessionStorage = () => {
    sessionStorage.setItem("hasSeenPromoPopup", "true")
  }

  const submitAndClose = () => {
    setSessionStorage()
    setIsOpen(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-[90%] p-0 md:max-w-2xl lg:max-w-4xl xl:max-w-5xl"
          onEscapeKeyDown={submitAndClose}
          onCloseAutoFocus={submitAndClose}
          onPointerDownOutside={submitAndClose}
          onInteractOutside={submitAndClose}
          transparentOverlay
          scrollableOverlay
        >
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2">
              <Image
                mode="cover"
                id={config.popupImage.id}
                alt=""
                width={600}
                height={800}
                preview={config.popupImage.preview}
                loading="eager"
                className="h-full sm:rounded-l-lg"
                hotspot={
                  config.popupImage.hotspot?.width
                    ? config.popupImage.hotspot
                    : undefined
                }
                crop={
                  config.popupImage.crop?.left
                    ? config.popupImage.crop
                    : undefined
                }
              />
            </div>
            <div className="flex w-full flex-col justify-center p-6 md:w-1/2">
              <div>
                <Typography.H1>{config.popupTitle}</Typography.H1>
                <Prose
                  className="!dark:text-zinc-400 !mb-0 !mt-4 font-sans !text-zinc-500"
                  disableHolyGrail
                >
                  <PortableText
                    value={config.popupCopy}
                    components={PortableTextComponents}
                  />
                </Prose>
                <a
                  href={config.popupButtonUrl}
                  className="inline-flex h-10 items-center justify-center whitespace-nowrap bg-brand px-4 py-2 text-sm font-medium text-white ring-offset-white transition-colors hover:bg-brandHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-brand dark:text-white dark:ring-offset-zinc-950 dark:hover:bg-brandHover dark:focus-visible:ring-zinc-300"
                  onClick={() => setSessionStorage()}
                >
                  {config.popupButtonText}
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
