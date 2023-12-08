import { type Config } from "tailwindcss"

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["PT Serif", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config
