/** @type {import('tailwindcss').Config} */
var colors = require("tailwindcss/colors");
var theme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        "3xl": "1728px",
      },

      colors: {
        gray: {
          1000: "#0a0c1f",
        },
      },
      fontFamily: {
        sans: ["Inter var", ...theme.fontFamily.sans],
      },
    },
    colors: {
      white: "white",
      black: "black",
      transparent: "transparent",
      gray: colors.gray,

      brand: {
        DEFAULT: "#8000FF",
        100: "#F1E6FF",
        300: "#D4BAF7",
        500: "#8000FF",
        700: "#5814B8",
        900: "#3B1782",
      },

      info: colors.slate,
      error: colors.red,
      alert: colors.yellow,
      success: colors.emerald,

      post: colors.violet,
      reels: colors.fuchsia,
      meeting: colors.sky,
      stories: colors.orange,
      task: colors.teal,
      tiktok: colors.rose,

      idea: colors.amber,
      do: colors.orange,
      doing: colors.pink,
      review: colors.violet,
      done: colors.sky,
      accomplished: colors.lime,
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
