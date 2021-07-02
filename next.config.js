const path = require("path");

if (process.platform === "win32") {
	process.env.ESBUILD_BINARY_PATH = path.join(
		process.cwd(),
		"node_modules",
		"esbuild",
		"esbuild.exe",
	);
} else {
	process.env.ESBUILD_BINARY_PATH = path.join(
		process.cwd(),
		"node_modules",
		"esbuild",
		"bin",
		"esbuild",
	);
}

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
