import { Form, useSubmit } from "@remix-run/react"
import { useEffect } from "react"
import { toast } from "sonner"

export const CookieBanner = () => {
  const submit = useSubmit()
  const formData = new FormData()
  formData.append("accept-gdpr", "true")

  useEffect(() => {
    // Run after Sonner’s useEffect subscriber is registered. Portals mount after
    // useLayoutEffect, so a synchronous toast here can fire before subscribe exists.
    const id = window.setTimeout(() => {
      toast("This website uses cookies.", {
        description:
          "Cookies help us deliver the best experience on our website.",
        onDismiss: () => {
          submit(formData, { method: "post" })
        },
        action: {
          label: "I understand",
          onClick: () => {
            toast.dismiss()
            submit(formData, { method: "post" })
            // Once affirmative consent has been granted
            window.fbq("consent", "grant")
          },
        },
        duration: Infinity,
      })
    }, 0)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <Form method="post" reloadDocument>
      <input type="hidden" name="accept-gdpr" value="true" />
    </Form>
  )
}
