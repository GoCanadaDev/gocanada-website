export function getBodyClassNames(themePreference?: string): string {
  // Use browser default if cookie is not set
  const isDarkMode = themePreference === `dark`
  // !themePreference && typeof document !== "undefined"
  //   ? window.matchMedia("(prefers-color-scheme: dark)").matches
  //   : themePreference === `dark`
  return [
    `transition-colors duration-500 ease-in-out min-h-screen font-sans-serif min-h-screen grid grid-rows-[auto_1fr_auto] relative`,
    isDarkMode ? `dark bg-zinc-900 text-zinc-300` : `bg-white text-zinc-900`,
  ]
    .join(" ")
    .trim()
}
