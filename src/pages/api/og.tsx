import Avatar from "boring-avatars";
import * as playwright from "playwright-aws-lambda";
import { renderToStaticMarkup } from "react-dom/server";
import { nc } from "~/lib/utils.server";

const html = String.raw;

const blocked_domains = ["googlesyndication.com", "adservice.google.com"];

const minimal_args = [
	"--autoplay-policy=user-gesture-required",
	"--disable-background-networking",
	"--disable-background-timer-throttling",
	"--disable-backgrounding-occluded-windows",
	"--disable-breakpad",
	"--disable-client-side-phishing-detection",
	"--disable-component-update",
	"--disable-default-apps",
	"--disable-dev-shm-usage",
	"--disable-domain-reliability",
	"--disable-extensions",
	"--disable-features=AudioServiceOutOfProcess",
	"--disable-hang-monitor",
	"--disable-ipc-flooding-protection",
	"--disable-notifications",
	"--disable-offer-store-unmasked-wallet-cards",
	"--disable-popup-blocking",
	"--disable-print-preview",
	"--disable-prompt-on-repost",
	"--disable-renderer-backgrounding",
	"--disable-setuid-sandbox",
	"--disable-speech-api",
	"--disable-sync",
	"--hide-scrollbars",
	"--ignore-gpu-blacklist",
	"--metrics-recording-only",
	"--mute-audio",
	"--no-default-browser-check",
	"--no-first-run",
	"--no-pings",
	"--no-sandbox",
	"--no-zygote",
	"--password-store=basic",
	"--use-gl=swiftshader",
	"--use-mock-keychain",
];

const templates: Record<string, (props: Record<string, string>) => string> = {
	collection: ({ id, name, userName }) => {
		const htmlString = renderToStaticMarkup(
			<Avatar name={id} variant="marble" size={96} />,
		);

		return html`
			<!DOCTYPE html>
			<html>
				<head>
					<style>
						@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

						* {
							box-sizing: border-box;
						}

						body {
							margin: 0;
							font-family: system-ui, sans-serif;
						}

						html {
							font-family: "Inter", sans-serif;
						}

						.wrapper {
							width: 1200px;
							height: 630px;
							display: flex;
							align-items: center;
							justify-content: center;
							background-color: white;
						}

						.content {
							margin-left: 32px;
							display: flex;
							flex-direction: column;
						}

						.title {
							font-weight: 700;
							font-size: 2.25rem;
							line-height: 2.5rem;
						}

						.subtitle {
							margin-top: -16px;
							font-weight: 500;
						}
					</style>
				</head>
				<body>
					<div class="wrapper">
						${htmlString}
						<div class="content">
							<h1 class="title">${name}</h1>
							<p class="subtitle"><i>By</i> ${userName}</p>
						</div>
					</div>
				</body>
			</html>
		`;
	},
};

export default nc().get(async (req, res) => {
	const query = req.query as Record<string, string>;

	const width = 1200;
	const height = 630;

	const browser = await playwright.launchChromium({
		headless: true,
		args: minimal_args,
	});
	const page = await browser.newPage({
		viewport: {
			width,
			height,
		},
	});

	await page.setContent(templates[query.template](query));

	const data = await page.screenshot({
		type: "png",
		clip: {
			x: 0,
			y: 0,
			width,
			height,
		},
		omitBackground: true,
	});

	await browser.close();

	if (process.env.NODE_ENV === "production") {
		// Set the s-maxage property which caches the images then on the Vercel edge
		res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate");
	}

	res.setHeader("Content-Type", "image/png");

	// write the image to the response with the specified Content-Type
	res.end(data);
});
