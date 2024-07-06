import { Form, useSubmit } from "@remix-run/react"
import { useEffect } from "react"
import { toast } from "sonner"

export const CookieBanner = () => {
  const submit = useSubmit()
  const formData = new FormData()
  formData.append("accept-gdpr", "true")

  useEffect(() => {
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
        },
      },
      duration: Infinity,
    })
  }, [])

  return (
    <Form method="post" reloadDocument>
      <input type="hidden" name="accept-gdpr" value="true" />
    </Form>
  )
}
