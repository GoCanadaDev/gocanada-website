import { useRootLoaderData } from "~/lib/useRootLoaderData"
import { Link, useParams } from "react-router";
import { SupportedLanguages } from "~/i18n"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import { Typography } from "./Typography"
import { Separator } from "./ui/separator"

const ListItem = ({ title, href }: { title: string; href: string }) => {
  return (
    <li>
      <Link
        to={href}
        prefetch="intent"
        className="block select-none space-y-1 rounded-md py-3 uppercase leading-none no-underline outline-none transition-colors  hover:text-brandHover  focus:text-brandHover focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:text-brandHover data-[state=open]:text-brandHover dark:hover:text-brandHover  dark:focus:text-brandHover dark:data-[active]:text-brandHover dark:data-[state=open]:text-brandHover"
      >
        <span className="text-sm font-medium leading-none">{title}</span>
      </Link>
    </li>
  )
}

const provinces = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Québec",
  "Saskatchewan",
]

const territories = ["Northwest Territories", "Nunavut", "Yukon"]

export function MobileNavigation() {
  const { categories } = useRootLoaderData()
  const { lang } = useParams()

  // need to backup to "en" if lang is not there for pages like Links which doesn't have a lang in the url
  const categoryTranslation = (lang || "en") as SupportedLanguages

  const provincesList = [...categories[0].subCategories].filter((c) =>
    provinces.includes(c.title[categoryTranslation])
  )

  const territoriesList = [...categories[0].subCategories].filter((c) =>
    territories.includes(c.title[categoryTranslation])
  )

  const citiesList = [...categories[0].subCategories].filter(
    (c) =>
      !provinces.includes(c.title[categoryTranslation]) &&
      !territories.includes(c.title[categoryTranslation])
  )

  return (
    <div className="mb-2 block w-full md:hidden">
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
                <Link
                  to={`/${categoryTranslation}/categories/${category.slug[categoryTranslation]}`}
                  prefetch="intent"
                  className="uppercase tracking-widest"
                >
                  {category.title[categoryTranslation]}
                </Link>
              </AccordionTrigger>
              <AccordionContent>
                {category.title[categoryTranslation] === "Destinations" ? (
                  <div className="">
                    <div>
                      <Typography.H4 className="text-base font-bold text-brand">
                        By Province
                      </Typography.H4>
                      <ul>
                        {provincesList
                          ?.sort((a, b) =>
                            a.title[categoryTranslation].localeCompare(
                              b.title[categoryTranslation]
                            )
                          )
                          .map((subCategory) => {
                            return (
                              <ListItem
                                key={subCategory.title[categoryTranslation]}
                                title={subCategory.title[categoryTranslation]}
                                href={`/${categoryTranslation}/categories/${category.slug[categoryTranslation]}/${subCategory.slug[categoryTranslation]}`}
                              />
                            )
                          })}
                      </ul>
                      <Separator
                        orientation="horizontal"
                        className="my-8 block h-0.5 md:hidden"
                      />
                      <Typography.H4 className="text-base font-bold text-brand">
                        By Territory
                      </Typography.H4>
                      <ul>
                        {territoriesList
                          ?.sort((a, b) =>
                            a.title[categoryTranslation].localeCompare(
                              b.title[categoryTranslation]
                            )
                          )
                          .map((subCategory) => {
                            return (
                              <ListItem
                                key={subCategory.title[categoryTranslation]}
                                title={subCategory.title[categoryTranslation]}
                                href={`/${categoryTranslation}/categories/${category.slug[categoryTranslation]}/${subCategory.slug[categoryTranslation]}`}
                              />
                            )
                          })}
                      </ul>
                      <Separator
                        orientation="horizontal"
                        className="my-8 block h-0.5 md:hidden"
                      />
                    </div>
                    <div>
                      <Typography.H4 className="text-base font-bold text-brand">
                        By City
                      </Typography.H4>
                      <ul>
                        {citiesList
                          ?.sort((a, b) =>
                            a.title[categoryTranslation].localeCompare(
                              b.title[categoryTranslation]
                            )
                          )
                          .map((subCategory) => {
                            if (subCategory.enabledInNav === false) {
                              return null
                            }
                            return (
                              <ListItem
                                key={subCategory.title[categoryTranslation]}
                                title={subCategory.title[categoryTranslation]}
                                href={`/${categoryTranslation}/categories/${category.slug[categoryTranslation]}/${subCategory.slug[categoryTranslation]}`}
                              />
                            )
                          })}
                      </ul>
                      <Separator
                        orientation="horizontal"
                        className="my-8 h-0.5"
                      />
                      <Typography.H4 className="text-base font-bold text-brand">
                        Anywhere
                      </Typography.H4>
                      <ul>
                        <ListItem
                          key="All of Canada"
                          title="All of Canada"
                          href={`/${categoryTranslation}/categories/${category.slug[categoryTranslation]}`}
                        />
                      </ul>
                    </div>
                  </div>
                ) : (
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[800px]">
                    {category.subCategories &&
                      Array.isArray(category.subCategories) &&
                      category.subCategories?.map((subCategory) => {
                        return (
                          <ListItem
                            key={subCategory.title[categoryTranslation]}
                            title={subCategory.title[categoryTranslation]}
                            href={`/${categoryTranslation}/categories/${category.slug[categoryTranslation]}/${subCategory.slug[categoryTranslation]}`}
                          />
                        )
                      })}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
