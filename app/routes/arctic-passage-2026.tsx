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
  Compass,
} from "lucide-react"

const PASSWORD = "arctic2026"

const animateClass =
  "animated opacity-0 translate-y-4 transition-all duration-1000 [&.scroll-animated]:opacity-100 [&.scroll-animated]:translate-y-0"

export const meta: MetaFunction = () => {
  const title = "Arctic Passage 2026"
  const description =
    "In August 2026, Go Canada Studios will embark on a 29-day expedition spanning the entire Canadian Arctic aboard Aurora Expeditions, following the legendary Northwest Passage through some of the most remote landscapes on the planet."
  const ogImageUrl = "https://gocanada.com/images/arctic-passage/og-image.jpg"
  const canonical = `https://gocanada.com/arctic-passage-2026`

  return [
    { title },
    { name: "description", content: description },
    { property: "og:description", content: description },
    { property: "og:image:height", content: String(OG_IMAGE_HEIGHT) },
    { property: "og:image:secure_url", content: ogImageUrl },
    { property: "og:image:type", content: "image/jpeg" },
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
    label: "29-Day Arctic Expedition",
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
          className="pb-96 sm:pb-[400px] md:pb-[100vh]"
          style={{
            backgroundImage: "url('/images/arctic-passage/map.jpg')",
            backgroundSize: "100% auto",
            backgroundPosition: "bottom center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#001f33",
          }}
        >
          <div className="container">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div
                className={cn(
                  animateClass,
                  "flex flex-col items-start justify-center gap-6"
                )}
              >
                <header className="flex w-full items-center justify-between gap-4 pt-8">
                  <Logo colorOverride="fill-sky-100" />

                  <div className="flex items-center gap-2">
                    <a
                      href="https://www.aurora-expeditions.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(animateClass, "delay-100")}
                    >
                      <img
                        alt=""
                        src="/images/arctic-passage/Aurora+Expeditions+Logo+White,+Horizontal.webp"
                        width="1306"
                        height="923"
                        sizes="auto, 100vw"
                        loading="lazy"
                        decoding="async"
                        className="w-32 hover:opacity-80"
                      />
                    </a>
                    <span className="text-xs font-bold uppercase tracking-widest text-sky-100/70 md:text-sm">
                      Expedition Partner
                    </span>
                  </div>
                </header>
                <h1 className="font-alternateSerif text-4xl leading-none tracking-[-.05em] md:text-7xl">
                  The Canadian Arctic. <br />
                  One Month. <br />
                  One Expedition. <br />
                  One Story.
                </h1>
                <div className="w-24 border-t-4 border-brandDark"></div>

                <p className="font-lg flex flex-col items-start justify-start gap-4 font-bold uppercase tracking-widest text-sky-200 sm:flex-row">
                  <span>A Go Canada Original Film</span>
                  <span className="hidden select-none opacity-30 sm:inline-flex">
                    |
                  </span>
                  <span>AUG 20-SEPT 20, 2026</span>
                </p>
                <p className="text-lg leading-relaxed">
                  In August 2026, Go Canada Studios will embark on a 29-day
                  expedition spanning the entire Canadian Arctic aboard{" "}
                  <a
                    className="underline opacity-80 transition-opacity duration-500 hover:opacity-100"
                    href="https://www.aurora-expeditions.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Aurora Expeditions
                  </a>
                  , following the legendary Northwest Passage through some of
                  the most remote landscapes on the planet.
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-100/70 md:text-sm">
                  Greenland <MoveRight className="text-brandDark" /> Nunavut
                  <MoveRight className="text-brandDark" />
                  Northwest Territories
                  <MoveRight className="text-brandDark" /> Yukon
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
                    "h-[50vh] flex-1 overflow-hidden rounded-3xl delay-100 lg:min-h-[calc(100vh-8rem)] lg:rounded-t-none"
                  )}
                >
                  <img
                    alt=""
                    src="/images/arctic-passage/DSC06693.webp"
                    width="4377"
                    height="6566"
                    sizes="auto, 100vw"
                    className="h-full scale-105 object-cover object-center transition-all duration-300 hover:scale-100"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div
                  className={cn(
                    animateClass,
                    "h-[50vh] flex-1 overflow-hidden rounded-3xl delay-100 lg:min-h-[calc(100vh-6rem)] lg:rounded-t-none"
                  )}
                >
                  <img
                    alt=""
                    src="/images/arctic-passage/DSC00393.webp"
                    width="2500"
                    height="1667"
                    sizes="auto, 100vw"
                    className="h-full scale-105 object-cover object-center transition-all duration-300 hover:scale-100"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div
                  className={cn(
                    animateClass,
                    "h-[50vh] flex-1 overflow-hidden rounded-3xl delay-100 lg:min-h-[calc(100vh-4rem)] lg:rounded-t-none"
                  )}
                >
                  <img
                    alt=""
                    src="/images/arctic-passage/DJI_20250706102219_0089_D.webp"
                    width="1599"
                    height="2399"
                    sizes="auto, 100vw"
                    className="h-full scale-105 object-cover object-center transition-all duration-300 hover:scale-100"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div
                  className={cn(
                    animateClass,
                    "h-[50vh] flex-1 overflow-hidden rounded-3xl delay-100 lg:min-h-[calc(100vh-2rem)] lg:rounded-t-none"
                  )}
                >
                  <img
                    alt=""
                    src="/images/arctic-passage/DSC09810.webp"
                    width="4672"
                    height="7008"
                    sizes="auto, 100vw"
                    className="h-full scale-105 object-cover object-center transition-all duration-300 hover:scale-100"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
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
            poster="/images/arctic-passage/DSC00393.webp"
            src="https://res.cloudinary.com/getpackup/video/upload/v1781376024/high-arctic_lpqw30.mp4"
            className="h-full w-full object-cover object-center"
          />
        </AspectRatio>
        <section className="bg-black/40">
          <div className="container">
            <div className="space-y-3 px-0 py-12 text-center md:px-12">
              <div className={cn(animateClass)}>
                <div className="font-lg font-bold uppercase tracking-widest text-sky-200">
                  A 29-Day Arctic Expedition
                </div>
                <h2 className="font-alternateSerif text-5xl leading-none tracking-[-.05em]">
                  A Go Canada Original Film
                </h2>
                <div className="mx-auto mt-4 w-24 border-t-4 border-brandDark"></div>
              </div>
              <p
                className={cn(
                  animateClass,
                  "mx-auto max-w-5xl rounded-3xl text-left text-xl leading-loose delay-150 md:px-6"
                )}
              >
                In August 2026, Go Canada Studios will join Aurora Expeditions
                on a 29-day journey through the entire Canadian Arctic through
                some of Canada's most remote Arctic waterways and communities.
                Traversing remote Arctic waterways, Inuit communities, towering
                icefields, and some of the most wildlife-rich regions on Earth,
                the expedition will be documented through Go Canada's first
                flagship original film, supported by photography and editorial
                storytelling from one of the last great wilderness frontiers on
                the planet.
              </p>
              <div className="flex flex-wrap gap-6 pt-8 sm:flex-nowrap">
                <div
                  className={cn(
                    animateClass,
                    "overflow-hidden rounded-3xl delay-100 sm:flex-1"
                  )}
                >
                  <img
                    alt=""
                    src="/images/arctic-passage/5.webp"
                    width="3375"
                    height="4219"
                    sizes="auto, 100vw"
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
                    src="/images/arctic-passage/6.webp"
                    width="3375"
                    height="4219"
                    sizes="auto, 100vw"
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
                    src="/images/arctic-passage/4.webp"
                    width="3375"
                    height="4219"
                    sizes="auto, 100vw"
                    loading="lazy"
                    decoding="async"
                    className="h-full scale-105 object-cover object-center transition-all duration-300 hover:scale-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="sample-film-work"
          className=""
          style={{
            backgroundImage:
              "radial-gradient(circle, #0C1C2B 1.2px, transparent 1.2px)",
            backgroundSize: "15px 15px",
          }}
        >
          <div className="container">
            <div className="py-12">
              <div className="space-y-6 rounded-3xl px-0 text-left text-lg md:px-12">
                <div className={cn(animateClass)}>
                  <h2 className="font-lg font-bold uppercase tracking-widest text-sky-200">
                    Sample Film Work
                  </h2>
                  <p>
                    Previous Arctic film work by expedition cinematographer{" "}
                    <a
                      href="https://www.instagram.com/jonanthonyjames/"
                      className="underline opacity-80 transition-opacity hover:opacity-100"
                    >
                      Jonanthony James
                    </a>
                    , who will lead production on the Canadian Arctic
                    expedition.
                  </p>
                  <div className="mt-4 w-24 border-t-4 border-brandDark"></div>
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
          </div>
        </section>
        <section className="bg-gradient-to-br from-slate-950 to-sky-950">
          <div className="container">
            <div className="space-y-6 px-0 py-12 text-center md:px-12">
              <div className={cn(animateClass)}>
                <div className="font-lg font-bold uppercase tracking-widest text-sky-200">
                  Project Snapshot
                </div>
                <h2 className="font-alternateSerif text-5xl leading-none tracking-[-.05em]">
                  Traversing the Northwest Passage
                </h2>
                <div className="mx-auto mt-4 w-24 border-t-4 border-brandDark"></div>
              </div>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {projectSnapshots.map(
                  ({ icon: Icon, label, delayClassName }) => (
                    <AspectRatio
                      ratio={1}
                      key={label}
                      className={cn(
                        animateClass,
                        "group select-none rounded-3xl bg-black/40 ",
                        delayClassName
                      )}
                    >
                      <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden p-6 font-alternateSerif text-base transition-colors duration-300 hover:bg-black/20 sm:text-xl lg:text-2xl xl:text-3xl">
                        <div className="absolute z-0 text-sky-950">
                          <Icon className="size-32 opacity-30 transition-transform duration-300 group-hover:rotate-6 lg:size-40 xl:size-48" />
                        </div>
                        <div className="relative z-10">{label}</div>
                      </div>
                    </AspectRatio>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
        <div
          className="relative overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: "url(/images/arctic-passage/DSC00359.webp)",
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
                <div className="mt-4 w-24 border-t-4 border-brandDark"></div>
                <p className="mt-4 max-w-3xl rounded-3xl bg-black/40 p-6 text-lg leading-relaxed">
                  Join us in documenting one of the world's last great
                  wilderness frontiers. A select group of partners will have the
                  opportunity to support the expedition and participate in the
                  creation of a flagship Go Canada Original Film, distributed
                  across Go Canada and @Canada platforms, alongside a
                  photography collection and editorial storytelling series from
                  the Canadian Arctic. Partners will receive tailored
                  opportunities for brand integration, promotional support,
                  original content licensing, and participation across film,
                  photography, editorial, and social media initiatives stemming
                  from the expedition.
                </p>
                <div className="space-y-4 pt-4 font-alternateSerif text-lg leading-relaxed">
                  <p className="flex items-center gap-2">
                    <Compass /> Presenting Partner (1 Available)
                  </p>
                  <p className="flex items-center gap-2">
                    <Compass /> Destination Partners (Limited Availability)
                  </p>
                  <p className="flex items-center gap-2">
                    <Compass /> Brand Partners (Limited Availability)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <section className="bg-slate-950">
          <div className="container">
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
                  All Rights Reserved.
                </p>
              </div>
            </div>
          </div>
        </section>
      </footer>
    </div>
  )
}
