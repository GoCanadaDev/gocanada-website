import { useEffect, useState } from "react"
import { Logo } from "~/components/Logo"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { toast } from "sonner"
import type { MetaFunction } from "@remix-run/node"
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "./resource.og"
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "~/lib/structuredData"
import { AspectRatio } from "~/components/ui/aspect-ratio"
import { cn } from "~/lib/utils"
import {
  AlarmClock,
  Calendar,
  Film,
  MapIcon,
  BookImage,
  ScissorsSquare,
  Ship,
  Users,
  Send,
  ScanEye,
  Mails,
  Eye,
  X,
  ArrowRightFromLine,
  MoveRight,
} from "lucide-react"

const PASSWORD = "arctic2026"

const animateClass =
  "animated opacity-0 translate-y-4 transition-all duration-1000 [&.scroll-animated]:opacity-100 [&.scroll-animated]:translate-y-0"

export const meta: MetaFunction = () => {
  const title = "Arctic Passage 2026"
  const description =
    "In August 2026, Go Canada Studios will embark on a 30-day expedition spanning the entire Canadian Arctic aboard Aurora Expeditions, following the legendary Northwest Passage through some of the most remote landscapes on the planet."
  const ogImageUrl = "TODO:"
  const canonical = `https://gocanada.com/arctic-passage-2026`

  return [
    { title },
    { name: "description", content: description },
    { property: "og:description", content: description },
    { property: "og:image:height", content: String(OG_IMAGE_HEIGHT) },
    { property: "og:image:secure_url", content: ogImageUrl },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: String(OG_IMAGE_WIDTH) },
    { property: "og:image", content: ogImageUrl },
    { property: "og:locale", content: "en_CA" },
    { property: "og:site_name", content: "Go Canada" },
    { property: "og:title", content: title },
    { property: "og:type", content: "article" },
    {
      property: "og:url",
      content: canonical,
    },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:description", content: description },
    { property: "twitter:image", content: ogImageUrl },
    { property: "twitter:site", content: "@gocanada" },
    { property: "twitter:title", content: title },
    {
      tagName: "link",
      rel: "canonical",
      href: canonical,
    },
    {
      "script:ld+json": generateOrganizationSchema(),
    },
    {
      "script:ld+json": generateWebsiteSchema(),
    },
    {
      "script:ld+json": generateBreadcrumbSchema([
        {
          name: "Home",
          url: "https://gocanada.com/",
        },
        {
          name: title,
          url: canonical,
        },
      ]),
    },
  ]
}

const projectSnapshots = [
  {
    icon: Calendar,
    label: "30-Day Arctic Expedition",
    delayClassName: "delay-100",
  },
  { icon: Ship, label: "1 Expedition Vessel", delayClassName: "delay-300" },
  { icon: AlarmClock, label: "100+ Hours at Sea", delayClassName: "delay-500" },
  { icon: MapIcon, label: "3 Arctic Regions", delayClassName: "delay-700" },
  {
    icon: Users,
    label: "Multiple Inuit Communities",
    delayClassName: "delay-100",
  },
  {
    icon: Film,
    label: "1 Flagship Original Film",
    delayClassName: "delay-300",
  },
  {
    icon: ScissorsSquare,
    label: "3 Social Video Cutdowns",
    delayClassName: "delay-500",
  },
  {
    icon: BookImage,
    label: "Photography Collection & Editorial Series",
    delayClassName: "delay-700",
  },
  {
    icon: Send,
    label:
      "Distribution: @Canada, GoCanada.com, Newsletter, Influencers & Media",
    delayClassName: "delay-100",
  },
  {
    icon: ScanEye,
    label: "2.8M+ Social Followers",
    delayClassName: "delay-300",
  },
  {
    icon: Mails,
    label: "21,000+ Newsletter Subscribers",
    delayClassName: "delay-500",
  },
  { icon: Eye, label: "Minimum 5M impressions", delayClassName: "delay-700" },
]

export default function ArcticPassage2026() {
  const [open, setOpen] = useState(true)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [input, setInput] = useState("")
  const [error, setError] = useState(false)

  useEffect(() => {
    if (open) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-animated")
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll(".scroll-animation .animated")
    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input === PASSWORD) {
      setOpen(false)
      toast.success("Access granted. Welcome to the Arctic Passage 2026.")
    } else {
      setError(true)
    }
  }

  return (
    <div className="scroll-animation min-h-screen !bg-sky-950 !text-sky-100 dark:bg-sky-950 dark:text-sky-100">
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent
          className="[&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Password Protected</DialogTitle>
            <DialogDescription>
              This page is for invited guests only. Please enter the password to
              continue.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 md:flex-row"
          >
            <div className="w-full">
              <Input
                type={passwordVisible ? "text" : "password"}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setError(false)
                }}
                placeholder="Enter password"
                autoFocus
                data-1p-ignore
              />

              <label
                htmlFor="show-password"
                className="ml-1 mt-1 flex cursor-pointer select-none items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400"
              >
                <input
                  type="checkbox"
                  id="show-password"
                  onChange={(e) => setPasswordVisible(e.target.checked)}
                />
                Show password
              </label>
              {error && (
                <p className="mt-1 text-sm text-brand">
                  Incorrect password. Please try again.
                </p>
              )}
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>

      <main
        className={cn("transition-opacity duration-700", open && "opacity-0")}
      >
        <section
          className="container pb-96 sm:pb-[400px] md:pb-[500px] lg:pb-[600px] xl:pb-[700px]"
          style={{
            backgroundImage: "url('/images/map.jpg')",
            backgroundSize: "100% auto",
            backgroundPosition: "bottom center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#001f33",
          }}
        >
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div
              className={cn(
                animateClass,
                "flex flex-col items-start justify-center gap-6"
              )}
            >
              <header className="flex items-center gap-4">
                <Logo colorOverride="fill-sky-100" />
                <X className="opacity-50" />
                <a
                  href="https://www.aurora-expeditions.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(animateClass, "delay-100")}
                >
                  <img
                    alt=""
                    src="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1769023825078-C03IRP9SVHZ0J1BKQRWR/Aurora+Expeditions+Logo+White%2C+Horizontal.png"
                    width="1306"
                    height="923"
                    sizes="auto, 100vw"
                    srcSet="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1769023825078-C03IRP9SVHZ0J1BKQRWR/Aurora+Expeditions+Logo+White%2C+Horizontal.png?format=100w 100w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1769023825078-C03IRP9SVHZ0J1BKQRWR/Aurora+Expeditions+Logo+White%2C+Horizontal.png?format=300w 300w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1769023825078-C03IRP9SVHZ0J1BKQRWR/Aurora+Expeditions+Logo+White%2C+Horizontal.png?format=500w 500w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1769023825078-C03IRP9SVHZ0J1BKQRWR/Aurora+Expeditions+Logo+White%2C+Horizontal.png?format=750w 750w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1769023825078-C03IRP9SVHZ0J1BKQRWR/Aurora+Expeditions+Logo+White%2C+Horizontal.png?format=1000w 1000w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1769023825078-C03IRP9SVHZ0J1BKQRWR/Aurora+Expeditions+Logo+White%2C+Horizontal.png?format=1500w 1500w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1769023825078-C03IRP9SVHZ0J1BKQRWR/Aurora+Expeditions+Logo+White%2C+Horizontal.png?format=2500w 2500w"
                    loading="lazy"
                    decoding="async"
                    className="w-48 hover:opacity-80"
                  />
                </a>
              </header>
              <h1 className="font-alternateSerif text-5xl leading-none tracking-[-.05em] md:text-7xl">
                The Canadian Arctic. <br />
                One Month. One Expedition. One Story.
              </h1>
              <div className="w-24 border-t-4 border-brandDark"></div>
              <p className="font-lg font-bold uppercase tracking-widest text-sky-200">
                A Go Canada Original Film
              </p>
              <p className="text-lg leading-relaxed">
                In August 2026, Go Canada Studios will embark on a 30-day
                expedition spanning the entire Canadian Arctic aboard{" "}
                <a
                  className="underline opacity-80 transition-opacity duration-500 hover:opacity-100"
                  href="https://www.aurora-expeditions.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Aurora Expeditions
                </a>
                , following the legendary Northwest Passage through some of the
                most remote landscapes on the planet.
              </p>

              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-100/70 md:text-sm">
                Greenland <MoveRight className="text-brandDark" /> Nunavut
                <MoveRight className="text-brandDark" />
                Northwest Territories
                <MoveRight className="text-brandDark" /> Alaska
              </div>
              <Button
                variant="default"
                className="!bg-brandDark hover:!bg-brand"
                size="lg"
                onClick={() =>
                  document
                    .getElementById("sample-film-work")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Watch Sample Film Work
              </Button>
            </div>
            <div className="flex gap-3">
              <div
                className={cn(
                  animateClass,
                  "h-96 flex-1 overflow-hidden rounded-3xl delay-100 md:min-h-[calc(100vh-8rem)] md:rounded-t-none"
                )}
              >
                <img
                  alt=""
                  src="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/e9a8f054-dd1f-4da9-9d4a-d357dd02146b/DSC06693.jpeg"
                  width="4377"
                  height="6566"
                  sizes="auto, 100vw"
                  className="h-full scale-105 object-cover object-center transition-all duration-300 hover:scale-100"
                  srcSet="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/e9a8f054-dd1f-4da9-9d4a-d357dd02146b/DSC06693.jpeg?format=100w 100w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/e9a8f054-dd1f-4da9-9d4a-d357dd02146b/DSC06693.jpeg?format=300w 300w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/e9a8f054-dd1f-4da9-9d4a-d357dd02146b/DSC06693.jpeg?format=500w 500w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/e9a8f054-dd1f-4da9-9d4a-d357dd02146b/DSC06693.jpeg?format=750w 750w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/e9a8f054-dd1f-4da9-9d4a-d357dd02146b/DSC06693.jpeg?format=1000w 1000w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/e9a8f054-dd1f-4da9-9d4a-d357dd02146b/DSC06693.jpeg?format=1500w 1500w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/e9a8f054-dd1f-4da9-9d4a-d357dd02146b/DSC06693.jpeg?format=2500w 2500w"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div
                className={cn(
                  animateClass,
                  "h-96 flex-1 overflow-hidden rounded-3xl delay-100 md:min-h-[calc(100vh-6rem)] md:rounded-t-none"
                )}
              >
                <img
                  alt=""
                  src="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/84b9436b-70e5-4e07-9c8a-54e7db8bd11c/DSC00393.jpg"
                  width="2500"
                  height="1667"
                  sizes="auto, 100vw"
                  className="h-full scale-105 object-cover object-center transition-all duration-300 hover:scale-100"
                  srcSet="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/84b9436b-70e5-4e07-9c8a-54e7db8bd11c/DSC00393.jpg?format=100w 100w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/84b9436b-70e5-4e07-9c8a-54e7db8bd11c/DSC00393.jpg?format=300w 300w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/84b9436b-70e5-4e07-9c8a-54e7db8bd11c/DSC00393.jpg?format=500w 500w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/84b9436b-70e5-4e07-9c8a-54e7db8bd11c/DSC00393.jpg?format=750w 750w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/84b9436b-70e5-4e07-9c8a-54e7db8bd11c/DSC00393.jpg?format=1000w 1000w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/84b9436b-70e5-4e07-9c8a-54e7db8bd11c/DSC00393.jpg?format=1500w 1500w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/84b9436b-70e5-4e07-9c8a-54e7db8bd11c/DSC00393.jpg?format=2500w 2500w"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div
                className={cn(
                  animateClass,
                  "h-96 flex-1 overflow-hidden rounded-3xl delay-100 md:min-h-[calc(100vh-4rem)] md:rounded-t-none"
                )}
              >
                <img
                  alt=""
                  src="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1768940251906-8Y1G4IYHZ92KPAKDJM7V/DJI_20250706102219_0089_D.jpg"
                  width="1599"
                  height="2399"
                  sizes="auto, 100vw"
                  className="h-full scale-105 object-cover object-center transition-all duration-300 hover:scale-100"
                  srcSet="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1768940251906-8Y1G4IYHZ92KPAKDJM7V/DJI_20250706102219_0089_D.jpg?format=100w 100w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1768940251906-8Y1G4IYHZ92KPAKDJM7V/DJI_20250706102219_0089_D.jpg?format=300w 300w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1768940251906-8Y1G4IYHZ92KPAKDJM7V/DJI_20250706102219_0089_D.jpg?format=500w 500w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1768940251906-8Y1G4IYHZ92KPAKDJM7V/DJI_20250706102219_0089_D.jpg?format=750w 750w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1768940251906-8Y1G4IYHZ92KPAKDJM7V/DJI_20250706102219_0089_D.jpg?format=1000w 1000w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1768940251906-8Y1G4IYHZ92KPAKDJM7V/DJI_20250706102219_0089_D.jpg?format=1500w 1500w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1768940251906-8Y1G4IYHZ92KPAKDJM7V/DJI_20250706102219_0089_D.jpg?format=2500w 2500w"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div
                className={cn(
                  animateClass,
                  "h-96 flex-1 overflow-hidden rounded-3xl delay-100 md:min-h-[calc(100vh-2rem)] md:rounded-t-none"
                )}
              >
                <img
                  alt=""
                  src="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/8656d3bb-15e1-452f-b359-7af2340388ad/DSC09810.jpg"
                  width="4672"
                  height="7008"
                  sizes="auto, 100vw"
                  className="h-full scale-105 object-cover object-center transition-all duration-300 hover:scale-100"
                  srcSet="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/8656d3bb-15e1-452f-b359-7af2340388ad/DSC09810.jpg?format=100w 100w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/8656d3bb-15e1-452f-b359-7af2340388ad/DSC09810.jpg?format=300w 300w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/8656d3bb-15e1-452f-b359-7af2340388ad/DSC09810.jpg?format=500w 500w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/8656d3bb-15e1-452f-b359-7af2340388ad/DSC09810.jpg?format=750w 750w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/8656d3bb-15e1-452f-b359-7af2340388ad/DSC09810.jpg?format=1000w 1000w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/8656d3bb-15e1-452f-b359-7af2340388ad/DSC09810.jpg?format=1500w 1500w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/8656d3bb-15e1-452f-b359-7af2340388ad/DSC09810.jpg?format=2500w 2500w"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        <AspectRatio ratio={21 / 9} className="overflow-hidden">
          <video
            playsInline
            loop
            muted
            autoPlay
            poster="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1768940251914-JWBVTGRFFOBC130DNWS1/DSC00393.jpg?format=2500w"
            src="https://res.cloudinary.com/getpackup/video/upload/v1781376024/high-arctic_lpqw30.mp4"
            className="h-full w-full object-cover object-center"
          />
        </AspectRatio>
        <section className="container bg-black/40">
          <div className="space-y-6 px-0 py-12 text-center md:px-12">
            <div className={cn(animateClass)}>
              <div className="font-lg font-bold uppercase tracking-widest text-sky-200">
                A 30-Day Arctic Expedition
              </div>
              <h2 className="font-alternateSerif text-5xl leading-none tracking-[-.05em]">
                A Go Canada Original Film
              </h2>
            </div>
            <p
              className={cn(
                animateClass,
                "mx-auto max-w-5xl rounded-3xl text-left text-xl leading-loose delay-150 sm:p-6 md:p-12"
              )}
            >
              In August 2026, Go Canada Studios will join Aurora Expeditions on
              a 30-day journey through the entire Canadian Arctic through some
              of Canada's most remote Arctic waterways and communities..
              Traversing remote Arctic waterways, Inuit communities, towering
              icefields, and some of the most wildlife-rich regions on Earth,
              the expedition will be documented through Go Canada's first
              flagship original film, supported by photography and editorial
              storytelling from one of the last great wilderness frontiers on
              the planet.
            </p>
            <div className="flex flex-wrap gap-6 sm:flex-nowrap">
              <div
                className={cn(
                  animateClass,
                  "overflow-hidden rounded-3xl delay-100 sm:flex-1"
                )}
              >
                <img
                  alt=""
                  src="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/72888b2c-63cd-4bed-a657-58f8834564ec/5.jpg"
                  width="3375"
                  height="4219"
                  sizes="auto, 100vw"
                  srcSet="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/72888b2c-63cd-4bed-a657-58f8834564ec/5.jpg?format=100w 100w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/72888b2c-63cd-4bed-a657-58f8834564ec/5.jpg?format=300w 300w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/72888b2c-63cd-4bed-a657-58f8834564ec/5.jpg?format=500w 500w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/72888b2c-63cd-4bed-a657-58f8834564ec/5.jpg?format=750w 750w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/72888b2c-63cd-4bed-a657-58f8834564ec/5.jpg?format=1000w 1000w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/72888b2c-63cd-4bed-a657-58f8834564ec/5.jpg?format=1500w 1500w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/72888b2c-63cd-4bed-a657-58f8834564ec/5.jpg?format=2500w 2500w"
                  loading="lazy"
                  decoding="async"
                  className="h-full scale-105 object-cover object-center transition-all duration-300 hover:scale-100"
                />
              </div>
              <div
                className={cn(
                  animateClass,
                  "overflow-hidden rounded-3xl delay-300 sm:flex-1"
                )}
              >
                <img
                  alt=""
                  src="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/4cd9d5e8-0f25-4f3c-b517-df394516c1f3/ARCTIC+%281%29.jpg"
                  width="3375"
                  height="4219"
                  sizes="auto, 100vw"
                  srcSet="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/4cd9d5e8-0f25-4f3c-b517-df394516c1f3/ARCTIC+%281%29.jpg?format=100w 100w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/4cd9d5e8-0f25-4f3c-b517-df394516c1f3/ARCTIC+%281%29.jpg?format=300w 300w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/4cd9d5e8-0f25-4f3c-b517-df394516c1f3/ARCTIC+%281%29.jpg?format=500w 500w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/4cd9d5e8-0f25-4f3c-b517-df394516c1f3/ARCTIC+%281%29.jpg?format=750w 750w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/4cd9d5e8-0f25-4f3c-b517-df394516c1f3/ARCTIC+%281%29.jpg?format=1000w 1000w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/4cd9d5e8-0f25-4f3c-b517-df394516c1f3/ARCTIC+%281%29.jpg?format=1500w 1500w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/4cd9d5e8-0f25-4f3c-b517-df394516c1f3/ARCTIC+%281%29.jpg?format=2500w 2500w"
                  loading="lazy"
                  decoding="async"
                  className="h-full scale-105 object-cover object-center transition-all duration-300 hover:scale-100"
                />
              </div>
              <div
                className={cn(
                  animateClass,
                  "overflow-hidden rounded-3xl delay-500 sm:flex-1"
                )}
              >
                <img
                  alt=""
                  src="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1379c83c-5167-48c2-9caf-addb56094424/4.jpg"
                  width="3375"
                  height="4219"
                  sizes="auto, 100vw"
                  srcSet="https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1379c83c-5167-48c2-9caf-addb56094424/4.jpg?format=100w 100w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1379c83c-5167-48c2-9caf-addb56094424/4.jpg?format=300w 300w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1379c83c-5167-48c2-9caf-addb56094424/4.jpg?format=500w 500w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1379c83c-5167-48c2-9caf-addb56094424/4.jpg?format=750w 750w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1379c83c-5167-48c2-9caf-addb56094424/4.jpg?format=1000w 1000w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1379c83c-5167-48c2-9caf-addb56094424/4.jpg?format=1500w 1500w, https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/1379c83c-5167-48c2-9caf-addb56094424/4.jpg?format=2500w 2500w"
                  loading="lazy"
                  decoding="async"
                  className="h-full scale-105 object-cover object-center transition-all duration-300 hover:scale-100"
                />
              </div>
            </div>
          </div>
        </section>
        <section
          id="sample-film-work"
          className="container"
          style={{
            backgroundImage:
              "radial-gradient(circle, #0C1C2B 1.2px, transparent 1.2px)",
            backgroundSize: "15px 15px",
          }}
        >
          <div className="py-12">
            <div className="space-y-6 rounded-3xl px-0 text-left text-lg md:px-12">
              <div className={cn(animateClass)}>
                <h2 className="font-lg font-bold uppercase tracking-widest text-sky-200">
                  Sample Film Work
                </h2>
                <p>
                  Previous Arctic film work by expedition cinematographer{" "}
                  <a
                    href="https://jonanthonyjames.com/"
                    className="underline opacity-80 transition-opacity hover:opacity-100"
                  >
                    Jonanthony James
                  </a>
                  , who will lead production on the Canadian Arctic expedition.
                </p>
              </div>

              <div className="rounded-3xl bg-black/20 p-3">
                <AspectRatio
                  ratio={16 / 9}
                  className={cn(animateClass, "w-full delay-150")}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/W0HuvT8FXcg?si=1Nx66u8wMVk2CX81"
                    title="Svalbard Arctic Cruise: Polar Bears, Glaciers & Wildlife Expedition"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="rounded-2xl"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </section>
        <section className="container bg-gradient-to-br from-slate-950 to-sky-950">
          <div className="space-y-6 px-0 py-12 text-center md:px-12">
            <div className={cn(animateClass)}>
              <div className="font-lg font-bold uppercase tracking-widest text-sky-200">
                Project Snapshot
              </div>
              <h2 className="font-alternateSerif text-5xl leading-none tracking-[-.05em]">
                Traversing the Northwest Passage
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {projectSnapshots.map(({ icon: Icon, label, delayClassName }) => (
                <AspectRatio
                  ratio={1}
                  key={label}
                  className={cn(
                    animateClass,
                    "group select-none rounded-3xl bg-black/40 ",
                    delayClassName
                  )}
                >
                  <div className="font-alternateSerif relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden p-6 text-base transition-colors duration-300 hover:bg-black/20 sm:text-xl lg:text-2xl xl:text-3xl">
                    <div className="absolute z-0 text-sky-950">
                      <Icon className="size-32 opacity-30 transition-transform duration-300 group-hover:rotate-6 lg:size-40 xl:size-48" />
                    </div>
                    <div className="relative z-10">{label}</div>
                  </div>
                </AspectRatio>
              ))}
            </div>
          </div>
        </section>
        <div
          className="relative overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.squarespace-cdn.com/content/v1/622a5f75500b0c6e6e39166d/37839eeb-f1e5-4450-95c7-ef59de60b74e/DSC00359.jpg)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.2,
              backgroundImage:
                "radial-gradient(circle, #0C1C2B 0.8px, transparent 0.8px), radial-gradient(circle, #0C1C2B 0.8px, transparent 0.8px)",
              backgroundSize: "5px 20px, 20px 5px",
              backgroundPosition: "-2.5px -10px, -10px -2.5px",
            }}
          />
          <div className="container">
            <div className="flex flex-col justify-between gap-24 px-0 py-36 md:gap-[600px] md:px-12">
              <div className={cn(animateClass)}>
                <div className="font-lg font-bold uppercase tracking-widest text-sky-200">
                  Get involved
                </div>
                <h2 className="font-alternateSerif text-5xl leading-none tracking-[-.05em]">
                  Partnership Opportunities
                </h2>
              </div>
              <div className="flex flex-wrap gap-12 md:flex-nowrap">
                <div
                  className={cn(
                    animateClass,
                    "flex w-full flex-col items-center justify-center gap-3 rounded-3xl bg-black/40 p-12 text-center text-lg delay-100 md:w-2/3"
                  )}
                >
                  <h3 className="font-alternateSerif text-[60px] leading-none tracking-[-.05em]">
                    Presenting Partner
                  </h3>
                  <p className="font-lg font-bold uppercase tracking-widest text-sky-200">
                    One available
                  </p>
                </div>
                <div
                  className={cn(
                    animateClass,
                    "flex w-full flex-col items-center justify-center gap-3 rounded-3xl bg-black/40 p-12 text-center text-lg delay-300 md:w-1/3"
                  )}
                >
                  <h3 className="font-alternateSerif text-4xl leading-none tracking-[-.05em]">
                    Expedition &amp; Destination Partners
                  </h3>
                  <p className="font-lg font-bold uppercase tracking-widest text-sky-200">
                    Up to 3 Available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <section className="container bg-slate-950">
          <div className="flex flex-col items-center justify-center space-y-12 py-24 text-center">
            <Logo />
            <div className="space-y-3">
              <p>
                <a
                  href="mailto:rishad@gocanada.com"
                  className="font-alternateSerif text-xl tracking-wide hover:underline"
                >
                  &copy; {new Date().getFullYear()} Go Canada
                </a>
              </p>
              <p className="text-xs uppercase tracking-widest text-sky-200">
                A division of Stay &amp; Wander Media Inc. All Rights Reserved.
              </p>
            </div>
          </div>
        </section>
      </footer>
    </div>
  )
}
