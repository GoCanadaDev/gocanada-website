import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import GoCanadaLogoColour from "../../public/images/logotype-colour-sm.png"
import GoCanadaLogoReverse from "../../public/images/logotype-colour-reverse-sm.png"
import { useRootLoaderData } from "~/lib/useRootLoaderData"
import SubscribeForm from "./SubscribeForm"
import { Typography } from "./Typography"

export default function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { themePreference } = useRootLoaderData()

  useEffect(() => {
    const hasSeenWelcomeDialog = localStorage.getItem("hasSeenWelcomeDialog")
    if (!hasSeenWelcomeDialog) {
      setIsOpen(true)
      localStorage.setItem("hasSeenWelcomeDialog", "true")
    }
  }, [])

  useEffect(() => {
    if (submitted) {
      setTimeout(() => {
        setIsOpen(false)
      }, 3000)
    }
  }, [submitted])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-xs md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl">
            {submitted
              ? `Thanks, we've received your request.`
              : "Welcome, Travel Lover!"}
          </DialogTitle>
          <DialogDescription>
            {submitted
              ? "Please check your email to confirm your subscription."
              : "Go Canada is a brand new travel website that brings you the latest in inspiration and information, whether you are travelling to or within Canada. Sign up to receive the latest travel features, insider tips, giveaways and special offers, right in your inbox."}
          </DialogDescription>
        </DialogHeader>

        <SubscribeForm
          pageLocation={"welcome-dialog"}
          setModalOpen={setModalOpen}
          setSubmitted={setSubmitted}
        />

        <img
          src={
            themePreference === "dark"
              ? GoCanadaLogoReverse
              : GoCanadaLogoColour
          }
          alt="Go Canada Logo"
          className="mx-auto w-24 md:w-32"
        />
      </DialogContent>
    </Dialog>
  )
}
