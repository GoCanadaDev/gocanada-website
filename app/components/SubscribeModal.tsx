import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { useState } from "react"
import { Button } from "./ui/button"
import { Typography } from "./Typography"
import SubscribeForm from "./SubscribeForm"
import GoCanadaLogoColour from "../../public/images/logotype-colour-sm.png"
import GoCanadaLogoReverse from "../../public/images/logotype-colour-reverse-sm.png"
import { useRootLoaderData } from "~/lib/useRootLoaderData"

const SubscribeModal = ({
  pageLocation,
}: {
  pageLocation: "header" | "footer"
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const rootLoaderData = useRootLoaderData()
  const themePreference = rootLoaderData?.themePreference

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger
        className="focus:outline-none"
        aria-label="Newsletter Signup"
        asChild
      >
        <Button
          type="button"
          variant="link"
          className="px-1 py-0 text-sm uppercase tracking-wide text-brand hover:no-underline md:text-base"
        >
          Newsletter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl">
            {submitted
              ? `Thanks, we've received your request.`
              : "Sign up for the Go Canada newsletter"}
          </DialogTitle>
          <Typography.Paragraph className="text-sm">
            {submitted
              ? "Please check your email to confirm your subscription."
              : "Receive the latest in travel info and inspiration, plus insider tips, giveaways and special offers, right in your inbox."}
          </Typography.Paragraph>
        </DialogHeader>
        {submitted ? (
          <div>
            <Button
              type="button"
              onClick={() => setModalOpen(false)}
              variant="default"
            >
              Close
            </Button>
          </div>
        ) : (
          <SubscribeForm
            pageLocation={pageLocation}
            setModalOpen={setModalOpen}
            setSubmitted={setSubmitted}
          />
        )}

        <img
          src={
            themePreference === "dark"
              ? GoCanadaLogoReverse
              : GoCanadaLogoColour
          }
          alt="Go Canada Logo"
          className="w-24 md:w-32"
        />
      </DialogContent>
    </Dialog>
  )
}

export default SubscribeModal
