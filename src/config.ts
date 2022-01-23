import { MotionProps } from "framer-motion";
import { DefaultSeoProps } from "next-seo";

export const isSsr = typeof window === "undefined";

export const isProd = process.env.NODE_ENV === "production";

export const PASSWORD_REGEX =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const defaultSeoProps: DefaultSeoProps = {
	openGraph: {
		title: "Markbox - API-First Bookmarking For Developers",
		type: "website",
		locale: "en_IE",
		site_name: "Markbox",
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
	defaultTitle: "Markbox - API-First Bookmarking For Developers",
	titleTemplate: "%s | Markbox",
	canonical: "https://markbox.in",
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
