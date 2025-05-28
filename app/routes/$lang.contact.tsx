import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import isLangSupportedLang from "~/lib/isLangSupportedLang"
import {
  json,
  LoaderFunction,
  ActionFunction,
  HeadersFunction,
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
import Prose from "~/components/portable/Prose"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { HeroImage } from "~/components/HeroImage"
import { getSiteConfig, SiteConfigType } from "~/sanity/queries/siteConfig"
import { genericMetaTags } from "~/lib/utils"
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateBlogSchema,
  generateBreadcrumbSchema,
} from "~/lib/structuredData"

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: StaticPageLoaderData
}) => {
  const title = `Contact | ${data.siteConfig.siteTitle}`
  const description = data.siteConfig.siteDescription
  const canonical = `https://gocanada.com/en/contact`
  return genericMetaTags({
    title,
    description,
    canonical,
    schemas: [
      generateOrganizationSchema(),
      generateWebsiteSchema(),
      generateBlogSchema({ description }),
      generateBreadcrumbSchema([
        {
          name: "Home",
          url: "https://gocanada.com/en",
        },
        {
          name: "Contact",
          url: canonical,
        },
      ]),
    ],
  })
}

type StaticPageLoaderData = {
  staticPage: StaticPage
  siteConfig: SiteConfigType
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
  try {
    // 1. Parse form data
    const formData = await request.formData()

    // 2. Check honeypot field first - quick bot check
    if (
      formData.get("bot-field") &&
      String(formData.get("bot-field")).length > 0
    ) {
      // Return success to avoid revealing this is a trap
      // No redirect - simply "swallow" the submission silently
      return json({ success: true }, { status: 200 })
    }

    // 3. Validate required fields
    const requiredFields = ["firstName", "email", "subject", "message"]
    for (const field of requiredFields) {
      const value = formData.get(field)
      if (!value || String(value).trim() === "") {
        return json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // 4. Email format validation
    const email = String(formData.get("email") || "")
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      return json({ error: "Invalid email format" }, { status: 400 })
    }

    // 5. Create cleaned values object
    const values = {
      "form-name": "contact-form",
      "bot-field": "",
      firstName: String(formData.get("firstName") || "").slice(0, 50),
      lastName: String(formData.get("lastName") || "").slice(0, 50),
      email: email,
      subject: `${String(formData.get("subject") || "New inquiry")} - ${email}`,
      message: String(formData.get("message") || "").slice(0, 500),
    }

    // 6. Submit the form data
    await postFormUrlEncoded<typeof values>(values)

    // 7. Return success
    return redirect(`${request.url}?submitted`)
  } catch (error) {
    console.error("Contact form submission error:", error)
    return json({ error: "Failed to submit form" }, { status: 500 })
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  isLangSupportedLang(params.lang)

  const staticPage = await getStaticPageByRoute(client, params.lang, "/contact")
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

const Contact = () => {
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
    <Layout translationUrl={`/${otherLanguage}/contact`}>
      <article className="mb-24 mt-8">
        {staticPage.mainImage?.id ? (
          <div className="w-full">
            <HeroImage
              fullBleed={staticPage.mainImageFullBleed}
              id={staticPage.mainImage.id}
              title={staticPage.title[staticPage.language]}
              category={undefined}
              preview={staticPage.mainImage.preview}
              mainImageCaption={staticPage.mainImageCaption}
              mainImageAttribution={staticPage.mainImageAttribution}
              mainImageAttributionUrl={staticPage.mainImageAttributionUrl}
              mainImageGradientOverlay={staticPage.mainImageGradientOverlay}
              hotspot={staticPage.mainImage.hotspot}
              crop={staticPage.mainImage.crop}
              aspectRatio={staticPage.mainImage.aspectRatio}
              isSponsored={false}
              sponsoredText={undefined}
            />
          </div>
        ) : (
          <Prose>
            <Typography.H1>
              {staticPage.title[staticPage.language]}
            </Typography.H1>
          </Prose>
        )}
        <Prose>
          <PortableText
            value={staticPage.body[staticPage.language]}
            components={PortableTextComponents}
          />

          <div className="mt-8 flex flex-wrap gap-12 sm:flex-nowrap">
            <div className="w-full sm:w-1/2">
              {staticPage.secondaryImage?.id && (
                <Image
                  id={staticPage.secondaryImage.id}
                  alt={""}
                  width={640}
                  loading="lazy"
                  className="pointer-events-none !m-0 w-full"
                />
              )}
            </div>
            <div className="w-full sm:w-1/2">
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
                            <SelectItem value="Story Submission">
                              Story Submission
                            </SelectItem>
                            <SelectItem value="Media Inquiry">
                              Media Inquiry
                            </SelectItem>
                            <SelectItem value="Advertising Inquiry">
                              Advertising Inquiry
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
          </div>
        </Prose>
      </article>
    </Layout>
  )
}

export default Contact
