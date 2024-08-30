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
import GoCanadaLogoColour from "../../public/images/logotype-colour.png"

const SubscribeModal = ({
  pageLocation,
}: {
  pageLocation: "header" | "footer"
}) => {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger
        className="focus:outline-none"
        aria-label="Newsletter Signup"
        asChild
      >
        <Button
          type="button"
          className="gap-2 bg-brand uppercase tracking-wider hover:bg-brandHover dark:bg-brand dark:text-white dark:hover:bg-brandHover"
        >
          Newsletter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl">
            Sign up for the Go Canada newsletter
          </DialogTitle>
          <Typography.Paragraph className="text-sm">
            Receive the latest in travel info and inspiration, plus insider
            tips, giveaways and special offers, right in your inbox.
          </Typography.Paragraph>
        </DialogHeader>
        <SubscribeForm
          pageLocation={pageLocation}
          setModalOpen={setModalOpen}
        />
        <img
          src={GoCanadaLogoColour}
          alt="Go Canada Logo"
          className="w-24 md:w-32"
        />
      </DialogContent>
    </Dialog>
  )
}

export default SubscribeModal
