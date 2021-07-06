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
			// Based on @leerob's tailwind config. https://github.com/leerob/leerob.io
			typography(theme) {
				return {
					default: {
						h1: {
							"margin-bottom": "0px",
						},
					},
					dark: {
						css: {
							color: theme("colors.gray.300"),
							h1: { color: theme("colors.gray.100") },
							a: {
								color: theme("colors.blue.400"),
								"&:hover": {
									color: theme("colors.blue.600"),
								},
								code: { color: theme("colors.blue.400") },
							},
							blockquote: {
								borderLeftColor: theme("colors.gray.700"),
								color: theme("colors.gray.300"),
							},
							"h2,h3,h4": {
								color: theme("colors.gray.100"),
								// "scroll-margin-top": spacing[32],
							},
							hr: { borderColor: theme("colors.gray.700") },
							ol: {
								li: {
									"&:before": { color: theme("colors.gray.500") },
								},
							},
							ul: {
								li: {
									"&:before": { backgroundColor: theme("colors.gray.500") },
								},
							},
							strong: { color: theme("colors.gray.300") },
							thead: {
								color: theme("colors.gray.100"),
							},
							tbody: {
								tr: {
									borderBottomColor: theme("colors.gray.700"),
								},
							},
						},
					},
				};
			},
		},
	},
	variants: {
		extend: {
			backgroundColor: ["checked"],
			borderColor: ["checked"],
		},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("@tailwindcss/typography"),
		require("tailwind-scrollbar"),
	],
};
