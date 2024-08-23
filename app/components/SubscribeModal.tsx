import {
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
          className="gap-2 bg-brand hover:bg-brandHover dark:bg-brand dark:text-white dark:hover:bg-brandHover"
        >
          Newsletter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">
            Sign up for our Newsletter
          </DialogTitle>
          <Form {...form}>
            <RemixForm
              className="flex flex-col gap-4"
              method="post"
              action="/resource/subscribe"
              navigate={false}
            >
              <input type="hidden" name="pathname" value={location.pathname} />
              <input type="hidden" name="pageLocation" value={pageLocation} />
              <div className="columns-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
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
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} required aria-required type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Button
                  type="submit"
                  className="gap-2 bg-brand hover:bg-brandHover dark:bg-brand dark:text-white dark:hover:bg-brandHover"
                >
                  Subscribe
                </Button>
              </div>
            </RemixForm>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default SubscribeModal
