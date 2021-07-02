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
			{
				source: "/docs",
				destination: "/docs/introduction",
			},
		];
	},
};

module.exports = config;
