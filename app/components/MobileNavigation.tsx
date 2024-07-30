import { useState } from "react"
import { useRootLoaderData } from "~/lib/useRootLoaderData"
import { Link, useParams } from "@remix-run/react"
import { SupportedLanguages } from "~/i18n"
import { Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "~/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"

export function MobileNavigation() {
  const { categories } = useRootLoaderData()
  const { lang } = useParams()

  const [open, setOpen] = useState(false)

  // need to backup to "en" if lang is not there for pages like Links which doesn't have a lang in the url
  const categoryTranslation = (lang || "en") as SupportedLanguages

  return (
    <div className="inline-flex md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Menu size={24} />
        </SheetTrigger>
        <SheetContent className="w-full">
          <SheetHeader className="mt-4">
            <input
              type="search"
              placeholder="What are you looking for?"
              className="w-full rounded-sm border-2 p-3"
            />
          </SheetHeader>
          <Link to={`/${categoryTranslation}`} onClick={() => setOpen(false)}>
            <h3 className="border-b py-4 font-medium transition-all hover:underline">
              Home
            </h3>
          </Link>
          <Accordion type="single" collapsible>
            {categories.map((category) => {
              if (!category.enabled) {
                return null
              }
              return (
                <AccordionItem
                  value={category.title[categoryTranslation]}
                  key={category.title[categoryTranslation]}
                >
                  <AccordionTrigger>
                    {category.title[categoryTranslation]}
                  </AccordionTrigger>
                  <AccordionContent>
                    {category.subCategories &&
                      Array.isArray(category.subCategories) &&
                      category.subCategories?.map((subCategory) => (
                        <Link
                          key={subCategory.title[categoryTranslation]}
                          to={`/${categoryTranslation}/categories/${category.slug[categoryTranslation]}/${subCategory.slug[categoryTranslation]}`}
                          prefetch="intent"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-slate-100/50 data-[state=open]:bg-slate-100/50  dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 dark:data-[active]:bg-slate-800/50 dark:data-[state=open]:bg-slate-800/50"
                          onClick={() => setOpen(false)}
                        >
                          <span className="text-sm font-medium leading-none">
                            {subCategory.title[categoryTranslation]}
                          </span>
                        </Link>
                      ))}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </SheetContent>
      </Sheet>
    </div>
  )
}
