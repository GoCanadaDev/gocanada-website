import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import { json, LoaderFunction, ActionFunction } from "@remix-run/node"
import { getStaticPageByRoute, StaticPage } from "~/sanity/queries/staticPages"
import { client } from "~/sanity/client"
import { useLoaderData, Form as RemixForm } from "@remix-run/react"
import { PortableText } from "@portabletext/react"
import PortableTextComponents from "~/components/PortableTextComponents"
import { useOtherLanguage } from "~/lib/useOtherLanguage"
import { Image } from "~/components/Image"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import postFormUrlEncoded from "~/lib/postFormUrlEncoded"

type StaticPageLoaderData = {
  staticPage: StaticPage
}

const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  subject: z.string().min(2).max(100),
  message: z.string().min(2).max(500),
})

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  await postFormUrlEncoded(request.url, formData)

  return null
}

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)

  const staticPage = await getStaticPageByRoute(client, params.lang, "/contact")

  return json({ staticPage }, { status: 200 })
}

const RequiredText = () => (
  <span className="ml-2 text-sm font-normal text-slate-400">(required)</span>
)

const Contact = () => {
  const { staticPage } = useLoaderData() as StaticPageLoaderData
  const otherLanguage = useOtherLanguage()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Form has been successfully submitted")
    form.reset()
  }

  return (
    <Layout useMargins translationUrl={`/${otherLanguage}/contact`}>
      <article className="holy-grail prose prose-lg prose-slate mx-4 my-12 max-w-none lg:prose-xl dark:prose-invert prose-h1:font-serif prose-h2:font-serif prose-p:my-4  prose-a:text-brand hover:prose-a:text-brandHover prose-figure:my-4 prose-ol:my-0 prose-ol:ml-8 prose-ol:list-[lower-alpha] prose-ul:my-0 prose-li:my-0">
        <Typography.H1>{staticPage.title[staticPage.language]}</Typography.H1>
        <PortableText
          value={staticPage.body[staticPage.language]}
          components={PortableTextComponents}
        />
        <div className="mt-8 flex flex-wrap gap-12 sm:flex-nowrap">
          <div className="w-full sm:w-1/2">
            <Image
              id={staticPage.mainImage.id}
              alt={staticPage.mainImageCaption ?? ""}
              width={640}
              loading="lazy"
              className="pointer-events-none !m-0 w-full"
            />
          </div>
          <div className="w-full sm:w-1/2">
            <Form {...form}>
              <form
                // onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
                data-netlify="true"
                method="POST"
              >
                <input type="hidden" name="form-name" value="contact-form" />
                {/* <p className="hidden">
                  <label>
                    Don't fill this out if you're human:{" "}
                    <input name="bot-field" />
                  </label>
                </p> */}
                <div className="columns-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          First Name
                          <RequiredText />
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>
                          Last Name
                          <RequiredText />
                        </FormLabel>
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
                      <FormLabel>
                        Email
                        <RequiredText />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Subject
                        <RequiredText />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Message
                        <RequiredText />
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <div data-netlify-recaptcha="true"></div> */}
                <Button
                  type="submit"
                  className="bg-brand hover:bg-brandHover dark:bg-brand dark:text-white dark:hover:bg-brandHover"
                >
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </article>
    </Layout>
  )
}

export default Contact
