const colors = require("tailwindcss/colors");

console.log(
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
);
