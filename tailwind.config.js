const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./public/index.html", "./src/**/*.{vue,jsx,tsx,ts,js}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: { ...colors },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["checked"],
      borderColor: ["checked"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
