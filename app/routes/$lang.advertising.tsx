import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import {
  json,
  LoaderFunction,
  HeadersFunction,
  ActionFunction,
} from "@remix-run/node"
import { getStaticPageByRoute, StaticPage } from "~/sanity/queries/staticPages"
import { client } from "~/sanity/client"
import {
  useLoaderData,
  Form as RemixForm,
  redirect,
  useSearchParams,
  useSubmit,
  MetaFunction,
} from "@remix-run/react"
import { PortableText } from "@portabletext/react"
import PortableTextComponents from "~/components/portable"
import { useOtherLanguage } from "~/lib/useOtherLanguage"
import Prose from "~/components/portable/Prose"
import { getSiteConfig, SiteConfigType } from "~/sanity/queries/siteConfig"
import { genericMetaTags } from "~/lib/utils"
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
import { useEffect, useRef } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: StaticPageLoaderData
}) => {
  const title = `Advertising | ${data.siteConfig.siteTitle}`
  const description = data.siteConfig.siteDescription
  return genericMetaTags({
    title,
    description,
    canonical: "/en/advertising",
  })
}

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .max(50, {
      message: "First name must be at most 50 characters.",
    }),
  lastName: z.string().max(50, {
    message: "Last name must be at most 50 characters.",
  }),
  email: z.string().email(),
  subject: z.string({ required_error: "Please select a subject." }),
  message: z
    .string()
    .min(10, {
      message: "Message must be at least 10 characters.",
    })
    .max(500, {
      message: "Message must be at most 500 characters.",
    }),
})

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const values = {
    "form-name": "contact-form",
    "bot-field": String(formData.get("bot-field")) ?? "",
    firstName: String(formData.get("firstName")) ?? "",
    lastName: String(formData.get("lastName")) ?? "",
    email: String(formData.get("email")) ?? "",
    subject: `${String(formData.get("subject")) ?? `New Advertising inquiry`} - ${String(formData.get("email"))}`,
    message: String(formData.get("message")) ?? "",
  }

  if (values["bot-field"] !== "") {
    return null
  }

  await postFormUrlEncoded<typeof values>(values)

  return redirect(`${request.url}?submitted`)
}

type StaticPageLoaderData = {
  staticPage: StaticPage
  siteConfig: SiteConfigType
}

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)

  const staticPage = await getStaticPageByRoute(
    client,
    params.lang,
    "/advertising"
  )
  const siteConfig = await getSiteConfig(client)

  return json(
    { staticPage, siteConfig },
    {
      status: 200,
      headers: {
        // Always revalidate in the browser
        "Cache-Control": "public, max-age=0, must-revalidate",
        // Cache for a year in the CDN
        "Netlify-CDN-Cache-Control": "public, s-maxage=31536000",
        // Purge from the cache whenever the static page changes
        "Cache-Tag": `static-pages:${staticPage?._id}`,
      },
    }
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders

const RequiredText = () => (
  <span className="ml-2 font-sans text-sm font-normal text-zinc-500 dark:text-zinc-400">
    (required)
  </span>
)

const Advertising = () => {
  const { staticPage } = useLoaderData<StaticPageLoaderData>()
  const otherLanguage = useOtherLanguage()

  const [searchParams] = useSearchParams()
  const submit = useSubmit()
  const formRef = useRef<HTMLFormElement>(null)

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

  useEffect(() => {
    if (searchParams.get("submitted") !== null) {
      toast.success(`Thanks, we've received your message.`)
      form.reset()
    }
  }, [searchParams])

  const handleSubmit = async () => {
    if (Object.keys(form.formState.errors).length === 0) {
      submit(formRef.current)
    }
  }

  return (
    <Layout translationUrl={`/${otherLanguage}/advertising`}>
      <article className="mb-24 mt-8">
        <div className="w-full">
          <video
            playsInline
            autoPlay
            loop
            muted
            poster="https://gocanadadev.github.io/video/cover.png"
            className="h-auto w-screen object-cover"
          >
            <source src={staticPage.videoUrl} type="video/mp4" />
          </video>
        </div>

        <Prose className="text-center">
          <Typography.H1>{staticPage.title[staticPage.language]}</Typography.H1>
        </Prose>

        <Prose>
          <PortableText
            value={staticPage.body[staticPage.language]}
            components={PortableTextComponents}
          />
          <div className="mt-8">
            <Typography.H1 className="mb-0">
              Partner with Us / Request a Media Kit
            </Typography.H1>
            <Typography.Paragraph>
              Please reach out using the form and someone from our team will be
              in contact.
            </Typography.Paragraph>

            <Form {...form}>
              <RemixForm
                className="space-y-2"
                data-netlify="true"
                method="POST"
                ref={formRef}
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <input type="hidden" name="form-name" value="contact-form" />
                <p className="hidden">
                  <label>
                    Don't fill this out if you're human:{" "}
                    <input name="bot-field" />
                  </label>
                </p>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
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
                      <FormItem className="flex-1">
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
                      <Select
                        name={field.name}
                        onValueChange={(e) => {
                          field.onChange(e)
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Partner With Us">
                            Partner With Us
                          </SelectItem>
                          <SelectItem value="Media Kit Request">
                            Media Kit Request
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <Textarea {...field} maxLength={500} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div data-netlify-recaptcha="true"></div>
                <Button
                  type="submit"
                  className="bg-brand font-sans font-bold hover:bg-brandHover dark:bg-brand dark:text-white dark:hover:bg-brandHover"
                >
                  Submit
                </Button>
              </RemixForm>
            </Form>
          </div>
        </Prose>
      </article>
    </Layout>
  )
}

export default Advertising
