import { SupportedLanguages } from "~/i18n"

export function formatDate(date: string, language: SupportedLanguages) {
  return new Date(date).toLocaleDateString(`${language}-CA`, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}
