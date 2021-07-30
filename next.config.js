const withPWA = require("next-pwa");
const withRemoteRefresh = require("next-remote-refresh");
const path = require("path");
const isProd = process.env.NODE_ENV === "productioon";

/**
 * @type {import("next/dist/next-server/server/config-shared").NextConfig}
 */
let config = {
	async redirects() {
		const redirects = [
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

		if (isProd)
			redirects.push({
				source: "/og",
				destination: "/",
				permanent: false,
			});

		return redirects;
	},
};

if (isProd) {
	config.pwa = {
		dest: "public",
		register: process.env.NODE_ENV === "production",
		disable: process.env.NODE_ENV !== "production",
	};

	config = withPWA(config);
}

if (!isProd)
	config = withRemoteRefresh({
		paths: [path.join(__dirname, "src/docs/**/*")],
	})(config);

module.exports = config;
