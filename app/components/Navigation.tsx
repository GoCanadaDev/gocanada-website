import React from "react"
import { useRootLoaderData } from "~/lib/useRootLoaderData"
import { Link, useParams } from "react-router";
import { SupportedLanguages } from "~/i18n"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu"
import { Typography } from "./Typography"
import { Separator } from "./ui/separator"

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ title, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={props.href!}
          ref={ref}
          prefetch="intent"
          className="block select-none space-y-1 rounded-md p-3 uppercase leading-none no-underline outline-none transition-colors  hover:text-brandHover  focus:text-brandHover focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:text-brandHover data-[state=open]:text-brandHover dark:hover:text-brandHover  dark:focus:text-brandHover dark:data-[active]:text-brandHover dark:data-[state=open]:text-brandHover"
          {...props}
        >
          <span className="text-sm font-medium leading-none tracking-widest">
            {title}
          </span>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})

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

export function Navigation() {
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
    <NavigationMenu className="-ml-4 hidden md:block">
      <NavigationMenuList>
        {categories.map((category) => {
          if (!category.enabled || !category.title[categoryTranslation]) {
            return null
          }
          return (
            <NavigationMenuItem
              key={category.title[categoryTranslation]}
              className="w-full md:w-auto"
            >
              <NavigationMenuTrigger>
                <Link
                  to={`/${categoryTranslation}/categories/${category.slug[categoryTranslation]}`}
                  prefetch="intent"
                  className="uppercase tracking-widest"
                >
                  {category.title[categoryTranslation]}
                </Link>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                {category.title[categoryTranslation] === "Destinations" ? (
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[800px]">
                    <div>
                      <Typography.H4 className="px-3 text-base font-bold text-brand">
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
                        className="my-8 h-0.5"
                      />
                      <Typography.H4 className="px-3 text-base font-bold text-brand">
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
                    </div>
                    <div>
                      <Typography.H4 className="px-3 text-base font-bold text-brand">
                        By City
                      </Typography.H4>
                      <ul>
                        {citiesList.map((subCategory) => {
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
                      <Typography.H4 className="px-3 text-base font-bold text-brand">
                        Anywhere
                      </Typography.H4>
                      <ul>
                        <ListItem
                          title="All of Canada"
                          href={`/${categoryTranslation}/categories/${category.slug[categoryTranslation]}`}
                        />
                      </ul>
                    </div>
                  </div>
                ) : (
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[800px]">
                    {category.subCategories &&
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
              </NavigationMenuContent>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
