/** @type {import('tailwindcss').Config} */
var colors = require("tailwindcss/colors");
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
    colors: {
      white: "white",
      black: "black",
      transparent: "transparent",
      gray: colors.slate,

      brand: {
        DEFAULT: "#8000FF",
        100: "#F1E6FF",
        // 300: "#C499FF",
        300: "#D4BAF7",
        500: "#8000FF",
        700: "#5814B8",
        900: "#3B1782",
      },

      error: colors.red,
      alert: colors.amber,
      success: colors.emerald,

      post: colors.violet,
      reels: colors.fuchsia,
      meeting: colors.sky,
      stories: colors.amber,
      task: colors.teal,
      tiktok: colors.rose,

      idea: colors.yellow,
      do: colors.orange,
      doing: colors.pink,
      review: colors.violet,
      done: colors.sky,
      accomplished: colors.emerald,
    },
  },
  plugins: [],
};
