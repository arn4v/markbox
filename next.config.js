const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

let config = withPWA({
	webpack: (config) => {
		return config;
	},
	async rewrites() {
		return [
			{
				source: "/register",
				destination: "/signup",
			},
			{
				source: "/settings",
				destination: "/settings/account",
			},
			{
				source: "/docs",
				destination: "/docs/introduction",
			},
		];
	},
	pwa: {
		dest: "public",
		disable: process.env.NODE_ENV !== "production",
		runtimeCaching,
	},
});

module.exports = config;
