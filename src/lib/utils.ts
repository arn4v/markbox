import { NextApiRequest } from "next";
import colors from "tailwindcss/colors";

export const validColors = Object.entries(colors).reduce(
	(acc, [key, value]) => {
		if (
			![
				"black",
				"gray",
				"coolGray",
				"trueGray",
				"blueGray",
				"warmGray",
				"white",
			].includes(key)
		)
			["400", "500", "600", "700"].forEach((i) => {
				acc.push(`bg-${key}-${i}`);
			});
		return acc;
	},
	[],
);

export function randomColor(tags: { color: string }[]) {
	const takenColors = Object.values(tags).map((i) => i.color);
	const available = validColors.filter((i) => !takenColors.includes(i));
	return available[Math.floor(Math.random() * available.length)];
}

export const getToken = async (req: NextApiRequest): Promise<string> => {
	return await new Promise((resolve, reject) => {
		if (
			typeof req.headers.authorization === "string" &&
			req.headers.authorization.length > 0 &&
			req.headers.authorization.includes("Bearer ")
		) {
			resolve(req.headers.authorization.replace("Bearer ", ""));
		} else {
			reject(new Error("No token in headers."));
		}
	});
};
