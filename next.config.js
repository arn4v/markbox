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
		];
	},
};

module.exports = config;
