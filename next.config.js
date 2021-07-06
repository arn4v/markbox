const withPWA = require("next-pwa");

/**
 * @type {import("next/dist/next-server/server/config-shared").NextConfig}
 */
let config = {
	async redirects() {
		return [
			{
				source: "/settings",
				destination: "/settings/account",
				permanent: false,
			},
			{
				source: "/docs",
				destination: "/docs/introduction",
				permanent: false,
			},
		];
	},
};

if (process.env.NODE_ENV === "production") {
	config = withPWA(
		Object.assign({}, config, {
			pwa: {
				dest: "public",
				register: process.env.NODE_ENV === "production",
				disable: process.env.NODE_ENV !== "production",
			},
		}),
	);
}

module.exports = config;
