const withPWA = require("next-pwa");

let config = {
	webpack: (config) => {
		return config;
	},
};

if (process.env.NODE_ENV === "production") {
	config = withPWA({
		...config,
		pwa: {
			dest: "public",
			disable: process.env.NODE_ENV !== "production",
		},
	});
}

module.exports = config;
