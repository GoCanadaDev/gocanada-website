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
  const { themePreference } = useRootLoaderData()

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger
        className="focus:outline-none"
        aria-label="Newsletter Signup"
        asChild
      >
        <Button
          type="button"
          className="gap-2 bg-transparent px-0 text-base uppercase tracking-widest text-brand hover:bg-brandHover hover:bg-transparent hover:text-brandHover md:bg-brand md:px-4 md:text-sm md:text-white md:hover:bg-brandHover md:hover:text-white dark:bg-transparent dark:text-brand dark:hover:bg-brandHover dark:hover:bg-transparent dark:hover:text-brandHover md:dark:bg-brand md:dark:text-white dark:md:hover:bg-brandHover dark:md:hover:text-white"
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
