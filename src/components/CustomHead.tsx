import { useTheme } from "next-themes";
import Head from "next/head";

const CustomHead = () => {
	const { theme } = useTheme();

	return (
		<Head>
			<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<link rel="manifest" href="/manifest.json" />
			<link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
			<meta name="apple-mobile-web-app-capable" content="yes" />
			<meta
				name="theme-color"
				content={theme === "light" ? "#ffffff" : "#000000"}
			/>
		</Head>
	);
};

export default CustomHead;
