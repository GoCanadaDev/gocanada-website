import {
  Link,
  Form as RemixForm,
  useLocation,
  useSearchParams,
} from "@remix-run/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Typography } from "./Typography"
import GoCanadaLogoColour from "../../public/images/logotype-colour.png"

const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50).optional(),
  email: z.string().email(),
})

const SubscribeModal = ({
  pageLocation,
}: {
  pageLocation: "header" | "footer"
}) => {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const [modalOpen, setModalOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  })

  useEffect(() => {
    if (searchParams.get("submitted") !== null) {
      setModalOpen(false)
      toast.success(`Thanks, we've received your newsletter signup request.`)
    }
  }, [searchParams])

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
        <Form {...form}>
          <RemixForm
            className="flex flex-col gap-4"
            method="post"
            action="/resource/subscribe"
            navigate={false}
          >
            <input type="hidden" name="pathname" value={location.pathname} />
            <input type="hidden" name="pageLocation" value={pageLocation} />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="font-normal">First Name *</FormLabel>
                    <FormControl>
                      <Input {...field} autoFocus required aria-required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="font-normal">Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal">Email *</FormLabel>
                  <FormControl>
                    <Input {...field} required aria-required type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <Typography.TextMuted className="text-xs">
                By signing up you agree to our{" "}
                <Link
                  to={`/${location.pathname.split("/")[1]}/terms`}
                  className="text-brand underline hover:text-brandHover"
                >
                  Terms of Use
                </Link>
                , our{" "}
                <Link
                  to={`/${location.pathname.split("/")[1]}/privacy`}
                  className="text-brand underline hover:text-brandHover"
                >
                  Privacy Policy
                </Link>{" "}
                and to receive marketing and subscription emails from Go Canada.
                You can unsubscribe from our newsletter at any time.
              </Typography.TextMuted>
              <div className="flex items-center justify-between">
                <div>
                  <Button
                    type="submit"
                    className="gap-2 bg-brand hover:bg-brandHover dark:bg-brand dark:text-white dark:hover:bg-brandHover"
                  >
                    Subscribe
                  </Button>
                  <span
                    onClick={() => setModalOpen(false)}
                    className="hidden cursor-pointer p-4 text-zinc-500 hover:text-zinc-400 sm:inline-block"
                  >
                    Cancel
                  </span>
                </div>
                <img
                  src={GoCanadaLogoColour}
                  alt="Go Canada Logo"
                  className="w-24 md:w-32"
                />
              </div>
            </div>
          </RemixForm>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default SubscribeModal
