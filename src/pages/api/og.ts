import { createHandler } from "~/lib/utils.server";
import { chromium } from "playwright";
import { chromiumArgs } from "~/lib/playwright";
import { BASE_URL } from "~/config";

const width = 1200,
	height = 627;

export default createHandler().get(async (req, res) => {
	const browser = await chromium.launch({
		args: chromiumArgs,
		headless: true,
	});

	const page = await browser.newPage({
		viewport: { height, width },
	});

	await page.goto(BASE_URL + "/og", {
		waitUntil: "networkidle",
		timeout: 0,
	});

	const data = await page.screenshot({
		type: "jpeg",
		clip: {
			x: 0,
			y: 0,
			width,
			height,
		},
		omitBackground: true,
	});

	await browser.close();

	// Set the s-maxage property which caches the images then on the Vercel edge
	res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate");
	res.setHeader("Content-Type", "image/jpeg");

	// write the image to the response with the specified Content-Type
	res.end(data);
});
