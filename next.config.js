const withPWA = require("next-pwa");
const withRemoteRefresh = require("next-remote-refresh");
const path = require("path");
const isProd = process.env.NODE_ENV === "productioon";

/**
 * @type {import("next/dist/next-server/server/config-shared").NextConfig}
 */
let config = {
	pageExtensions: ["ts", "tsx", "js", "jsx"],
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

config = require("next-mdx-builder")({
	layoutsPath: "layouts",
	extensions: ["mdx", "md"],
	layoutExtensions: ["js", "jsx", "ts", "tsx"],
	xdmOptions: {
		remarkPlugins: [
			require("remark-code-titles"),
			require("remark-slug"),
			[
				require("remark-autolink-headings"),
				{
					linkProperties: {
						className: ["anchor"],
					},
				},
			],
		],

		rehypePlugins: [require("mdx-prism")],
	},
})(config);

module.exports = config;
