import { MotionProps } from "framer-motion";
import { DefaultSeoProps } from "next-seo";

export const isSsr = typeof window === "undefined";

export const isProd = process.env.NODE_ENV === "production";

export const BASE_URL =
	process.env.NEXT_PUBLIC_BASE_URL ??
	(isProd ? "https://bookmarky.mnsht.xyz" : "http://localhost:3000");

export const PASSWORD_REGEX =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const defaultSeoProps: DefaultSeoProps = {
	openGraph: {
		title: "Bookmarky - API-First Bookmarking For Developers",
		type: "website",
		locale: "en_IE",
		site_name: "Bookmarky",
		images: [
			{
				url: "/static/og.jpg",
				height: 627,
				width: 1200,
			},
		],
	},
	twitter: {
		handle: "@arn4v",
		site: "@site",
		cardType: "summary_large_image",
	},
	defaultTitle: "Bookmarky - API-First Bookmarking For Developers",
	titleTemplate: "%s | Bookmarky",
	canonical: "https://bookmarky.mnsht.xyz",
};

export const genericModalMotionProps: MotionProps = {
	initial: { opacity: 0, y: -20 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -20 },
	transition: { duration: 0.2 },
};

export const genericModalProps = {
	containerProps: {
		className: "flex items-center justify-center z-[999]",
	},
	overlayProps: { className: "bg-black bg-opacity-75 z-[999]" },
};
