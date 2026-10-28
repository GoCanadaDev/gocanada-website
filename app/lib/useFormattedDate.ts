import { useEffect, useState } from "react"

import type { SupportedLanguages } from "~/i18n"

export const useFormattedDate = (
  date: string,
  language: SupportedLanguages
) => {
  const [formattedDate, setFormattedDate] = useState<string | null>(null)

  useEffect(
    () =>
      setFormattedDate(
        new Date(date).toLocaleDateString(`${language}-CA`, {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      ),
    []
  )

  return formattedDate
}
