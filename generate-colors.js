const colors = require("tailwindcss/colors");
const fs = require("fs");
const path = require("path");

delete colors.lightBlue;

fs.writeFileSync(
	path.resolve(__dirname, "colors.json"),
	JSON.stringify(
		Object.entries(colors).reduce((acc, [key, value]) => {
			if (typeof value === "string") {
				acc[key] = value;
			}

			if (
				!Array.isArray(value) &&
				value !== null &&
				typeof value === "object"
			) {
				Object.entries(value).forEach((item) => {
					acc[`${key}-${item[0]}`] = item[1];
				});
			}

			return acc;
		}, {}),
		null,
		4,
	),
);
