import { Layout } from "~/components/Layout"
import { Typography } from "~/components/Typography"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { useForm } from "react-hook-form"

const labelOptions = [
  { label: "Newsletter", value: "Newsletter" },
  { label: "Subscribe", value: "Subscribe" },
  { label: "Submit", value: "Submit" },
  { label: "Send", value: "Send" },
  { label: "Read More", value: "Read More" },
]
const roundednessOptions = [
  { label: "None", value: "rounded-none" },
  { label: "Small", value: "rounded-sm" },
  { label: "Medium", value: "rounded" },
  { label: "Large", value: "rounded-lg" },
  { label: "Full", value: "rounded-full" },
]
const fontFamilyOptions = [
  { label: "PT Sans (sans-serif)", value: "font-sans" },
  { label: "Rasa (heading serif)", value: "font-serif" },
  { label: "Libre Baskerville (body serif)", value: "font-body" },
]
const textTransformOptions = [
  { label: "None", value: "normal-case" },
  { label: "Uppercase", value: "uppercase" },
  { label: "Lowercase", value: "lowercase" },
]
const trackingOptions = [
  { label: "None", value: "tracking-normal" },
  { label: "Tighter", value: "tracking-tighter" },
  { label: "Tight", value: "tracking-tight" },
  { label: "Wide", value: "tracking-wide" },
  { label: "Wider", value: "tracking-wider" },
  { label: "Widest", value: "tracking-widest" },
]
const borderOptions = [
  { label: "None", value: "border-none" },
  { label: "Brand Light Outline", value: "border border-brandHover" },
  { label: "Brand Default Outline", value: "border border-brand" },
  {
    label: "Brand Dark Outline",
    value: "border border-brandDark hover:bg-brandDark",
  },
  { label: "White", value: "border border-white" },
  { label: "Black", value: "border border-zinc-900" },
]
const borderThicknessOptions = [
  { label: "None", value: "border-none" },
  { label: "1", value: "border" },
  { label: "2", value: "border-2" },
  { label: "4", value: "border-4" },
  { label: "8", value: "border-8" },
]
const backgroundOptions = [
  { label: "Default", value: "bg-brand" },
  {
    label: "White/Dark Background",
    value:
      "bg-white text-brand hover:text-white dark:bg-zinc-900 dark:text-zinc-300",
  },
  { label: "Brand Light Background", value: "bg-brandHover hover:bg-brand" },
  { label: "Brand Default Background", value: "bg-brand hover:bg-brandHover" },
  { label: "Brand Dark Background", value: "bg-brandDark hover:bg-brand" },
  {
    label: "R-to-L Gradient",
    value: "bg-gradient-to-r from-brand to-brandHover hover:to-brandDark",
  },
  {
    label: "T-to-B Gradient",
    value: "bg-gradient-to-b from-brand to-brandHover hover:to-brand",
  },
  {
    label: "TL-to-BR Gradient",
    value: "bg-gradient-to-br from-brand to-brandHover hover:to-brand",
  },
]

export default function Buttons() {
  const form = useForm({
    defaultValues: {
      label: labelOptions[0].value,
      roundedness: roundednessOptions[0].value,
      fontFamily: fontFamilyOptions[0].value,
      textTransform: textTransformOptions[0].value,
      tracking: trackingOptions[0].value,
      border: borderOptions[0].value,
      borderThickness: borderThicknessOptions[0].value,
      background: backgroundOptions[0].value,
    },
  })

  const formItemRenderer = (
    field:
      | "label"
      | "roundedness"
      | "fontFamily"
      | "textTransform"
      | "tracking"
      | "border"
      | "borderThickness"
      | "background",
    fieldLabel: string,
    options: { label: string; value: string }[]
  ) => (
    <FormField
      control={form.control}
      name={field}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Change {fieldLabel}:</FormLabel>

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
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage>
            {field.name === "border" &&
            form.watch("border") !== borderOptions[0].value &&
            form.watch("borderThickness") ===
              borderThicknessOptions[0].value ? (
              <p>Select a border thickness to see the border effect</p>
            ) : null}
          </FormMessage>
        </FormItem>
      )}
    />
  )

  return (
    <Layout>
      <Form {...form}>
        <article className="">
          <div className="mx-auto my-24 max-w-4xl space-y-8 text-xl">
            <Typography.H1>Button Generator</Typography.H1>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {formItemRenderer("label", "Text", labelOptions)}
                {formItemRenderer(
                  "roundedness",
                  "Roundedness",
                  roundednessOptions
                )}
                {formItemRenderer(
                  "fontFamily",
                  "Font Family",
                  fontFamilyOptions
                )}
                {formItemRenderer(
                  "textTransform",
                  "Text Transform",
                  textTransformOptions
                )}
                {formItemRenderer(
                  "tracking",
                  "Letter Spacing",
                  trackingOptions
                )}
                {formItemRenderer("border", "Border", borderOptions)}
                {formItemRenderer(
                  "borderThickness",
                  "Border Thickness",
                  borderThicknessOptions
                )}
                {formItemRenderer(
                  "background",
                  "Background",
                  backgroundOptions
                )}
              </div>

              <div className="flex items-center justify-center rounded bg-gray-100 dark:bg-zinc-800">
                <Button
                  className={cn(
                    form.watch("roundedness"),
                    form.watch("fontFamily"),
                    form.watch("textTransform"),
                    form.watch("tracking"),
                    form.watch("border"),
                    form.watch("borderThickness"),
                    form.watch("background")
                  )}
                >
                  {form.watch("label")}
                </Button>
              </div>
            </div>
          </div>
        </article>
      </Form>
    </Layout>
  )
}
