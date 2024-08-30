import {
  Link,
  Form as RemixForm,
  useLocation,
  useSearchParams,
} from "@remix-run/react"
import { useEffect } from "react"
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
import { cn } from "~/lib/utils"

const formSchema = z.object({
  email: z.string().email(),
})

const SubscribeForm = ({
  pageLocation,
  setModalOpen,
}: {
  pageLocation: "header" | "footer"
  setModalOpen?: (open: boolean) => void
}) => {
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  useEffect(() => {
    if (searchParams.get("submitted") !== null) {
      setModalOpen?.(false)
      toast.success(`Thanks, we've received your newsletter signup request.`)
    }
  }, [searchParams])

  return (
    <Form {...form}>
      <RemixForm
        className="flex flex-col gap-4 text-left"
        method="post"
        action="/resource/subscribe"
        navigate={false}
      >
        <input type="hidden" name="pathname" value={location.pathname} />
        <input type="hidden" name="pageLocation" value={pageLocation} />
        <div
          className={cn("flex w-full items-end space-x-2", {
            dark: pageLocation === "footer",
          })}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel
                  className={cn("font-normal", {
                    "sr-only": pageLocation === "footer",
                  })}
                >
                  Email *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    required
                    aria-required
                    type="email"
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="gap-2 bg-brand hover:bg-brandHover dark:bg-brand dark:text-white dark:hover:bg-brandHover"
          >
            Subscribe
          </Button>
        </div>
        <div className="space-y-4">
          <Typography.TextMuted className="text-pretty text-xs">
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
            and to receive marketing and subscription emails from Go Canada. You
            can unsubscribe from our newsletter at any time.
          </Typography.TextMuted>
        </div>
      </RemixForm>
    </Form>
  )
}

export default SubscribeForm
