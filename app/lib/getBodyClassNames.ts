export function getBodyClassNames(themePreference?: string): string {
  // Use browser default if cookie is not set
  const isDarkMode =
    !themePreference && typeof document !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : themePreference === `dark`
  return [
    `transition-colors duration-500 ease-in-out min-h-screen font-serif min-h-screen grid grid-rows-[auto_1fr_auto]`,
    isDarkMode ? `dark bg-slate-900 text-white` : `bg-white text-slate-900`,
  ]
    .join(" ")
    .trim()
}
