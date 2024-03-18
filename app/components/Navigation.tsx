import React from "react"
import { useRootLoaderData } from "~/lib/useRootLoaderData"
import { Link, useParams } from "@remix-run/react"
import { SupportedLanguages } from "~/i18n"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu"

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
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-slate-100/50 data-[state=open]:bg-slate-100/50  dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 dark:data-[active]:bg-slate-800/50 dark:data-[state=open]:bg-slate-800/50"
          {...props}
        >
          <span className="text-sm font-medium leading-none">{title}</span>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})

export function Navigation() {
  const { categories } = useRootLoaderData()
  const { lang } = useParams()

  // need to backup to "en" if lang is not there for pages like Links which doesn't have a lang in the url
  const categoryTranslation = (lang || "en") as SupportedLanguages

  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList>
        {categories.map((category) => (
          <NavigationMenuItem key={category.title[categoryTranslation]}>
            <NavigationMenuTrigger>
              {category.title[categoryTranslation]}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[800px] ">
                {category.subCategories &&
                  Array.isArray(category.subCategories) &&
                  category.subCategories?.map((subCategory) => (
                    <ListItem
                      key={subCategory.title[categoryTranslation]}
                      title={subCategory.title[categoryTranslation]}
                      href={`/${categoryTranslation}/categories/${category.slug[categoryTranslation]}/${subCategory.slug[categoryTranslation]}`}
                    />
                  ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
