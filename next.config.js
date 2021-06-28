const withPWA = require("next-pwa");

let config = {
	webpack: (config) => {
		return config;
	},
};

config = withPWA(
	Object.assign(config, {
		pwa: {
			dest: "public",
			disable: process.env.NODE_ENV !== "production",
		},
	}),
);

module.exports = config;
