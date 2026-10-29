import { zodResolver } from "@hookform/resolvers/zod"
import { Form as RemixForm, Link, useLocation } from "@remix-run/react"
import type { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { cn } from "~/lib/utils"

import { Typography } from "./Typography"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

const formSchema = z.object({
  email: z.string().email(),
})

export const SubscribeForm = ({
  pageLocation,
  setModalOpen,
  setSubmitted,
}: {
  pageLocation: "header" | "footer" | "welcome-dialog" | "newsletter" | string
  setModalOpen?: (open: boolean) => void
  setSubmitted?: Dispatch<SetStateAction<boolean>>
}) => {
  const location = useLocation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const handleSubmit = () => {
    if (
      pageLocation === "footer" ||
      (pageLocation !== "header" && pageLocation !== "welcome-dialog")
    ) {
      toast.success(`Thank you for subscribing!`, {
        description: `Please check your inbox for a welcome message to ensure newsletters are not ending up in your junk mail.`,
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss()
          },
        },
      })
      if (typeof setModalOpen === "function") {
        setModalOpen?.(false)
      }
    }
    if (
      (pageLocation === "header" || pageLocation === "welcome-dialog") &&
      typeof setSubmitted === "function"
    ) {
      setSubmitted(true)
    }
    form.reset()
  }

  return (
    <Form {...form}>
      <RemixForm
        className="flex flex-col gap-4 text-left"
        method="post"
        action="/resource/subscribe"
        navigate={false}
        onSubmit={handleSubmit}
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
          <Button type="submit" className="gap-2">
            Subscribe
          </Button>
        </div>
        <div className="space-y-4">
          <Typography.TextMuted className="text-pretty">
            By pressing subscribe, I agree to receive email communications from{" "}
            <Link to="/en" className="text-brand underline">
              GoCanada.com
            </Link>
            , including travel tips, stories, and giveaways. I understand I can
            unsubscribe at any time. We respect your privacy.{" "}
            <Link to="/en/privacy" className="text-brand underline">
              Privacy Policy
            </Link>
          </Typography.TextMuted>
        </div>
      </RemixForm>
    </Form>
  )
}
