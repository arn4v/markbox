let config = {
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
		];
	},
};

module.exports = config;
