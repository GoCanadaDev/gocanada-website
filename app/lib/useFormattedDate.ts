import { SupportedLanguages } from "~/i18n"

import { useState, useEffect } from "react"

const useFormattedDate = (date: string, language: SupportedLanguages) => {
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

export default useFormattedDate
