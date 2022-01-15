import "@fontsource/inter";
import "@fontsource/poppins";
import { httpLink } from "@trpc/client/links/httpLink";
import { withTRPC } from "@trpc/next";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import "prism-themes/themes/prism-gruvbox-dark.css";
import * as React from "react";
import { Toaster } from "react-hot-toast";
import superjson from "superjson";
import CustomHead from "~/components/CustomHead";
import { WithProviders } from "~/components/WithProviders";
import { defaultSeoProps } from "~/config";
import { getDeploymentUrl } from "~/lib/misc";
import type { AppRouter } from "~/server/routers/_app";
import "~/styles/index.css";

function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Toaster />
			<DefaultSeo {...defaultSeoProps} />
			<CustomHead />
			<WithProviders>
				<Component {...pageProps} />
			</WithProviders>
		</>
	);
}

export default withTRPC<AppRouter>({
	config() {
		return {
			links: [
				httpLink({
					url: `${getDeploymentUrl()}/api/trpc`,
				}),
			],
			url: `${getDeploymentUrl()}/api/trpc`,
			transformer: superjson,
		};
	},
	ssr: true,
})(App);
