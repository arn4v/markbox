import Avatar from "boring-avatars";
import { withOGImage } from "next-api-og-image";
import { renderToStaticMarkup } from "react-dom/server";

const html = String.raw;

export default withOGImage({
	template: {
		html({ id, name, userName }) {
			const htmlString = renderToStaticMarkup(
				<Avatar name={id} variant="marble" size={48} />,
			);

			return html`
				<!DOCTYPE html>
				<html>
					<head>
						<style>
							@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

							html {
								font-family: "Inter", sans-serif;
							}

							.wrapper {
								width: 1200px;
								height: 630px;
								display: flex;
								flex-direction: column;
								align-items: center;
								justify-content: center;
							}

							h1 {
								font-weight: 700;
							}

							p {
								font-weight: 500;
							}
						</style>
					</head>
					<body>
						<div class="wrapper">
							${htmlString}
							<h1>${name}</h1>
							<p><i>By</i> ${userName}</p>
						</div>
					</body>
				</html>
			`;
		},
	},
});
