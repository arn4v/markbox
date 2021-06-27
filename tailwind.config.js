const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

delete colors.lightBlue;

/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
module.exports = {
	mode: "jit",
	purge: ["./src/**/*.{jsx,tsx,ts,js,css}"],
	darkMode: "class",
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
