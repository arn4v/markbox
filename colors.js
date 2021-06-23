const colors = require("tailwindcss/colors");
const fs = require("fs");
const path = require("path");

delete colors.lightBlue;

fs.writeFileSync(
	path.resolve(__dirname, "colors.json"),
	JSON.stringify(
		JSON.parse(
			"[" +
				Object.entries(colors)
					.reduce((acc, [key, value]) => {
						if (typeof value === "string") {
							acc = acc.concat([`"${key}"`]);
						}

						if (
							!Array.isArray(value) &&
							value !== null &&
							typeof value === "object"
						) {
							acc = acc.concat(
								Object.keys(value).map((item) => `"${key}-${item}"`),
							);
						}

						return acc;
					}, [])
					.join(" , ") +
				"]",
		),
		null,
		4,
	),
);
