import "@fontsource/inter";
import { withTRPC } from "@trpc/next";
import "@fontsource/poppins";
import "prism-themes/themes/prism-gruvbox-dark.css";
import "~/styles/index.css";
import * as React from "react";
import CustomHead from "~/components/CustomHead";
import superjson from "superjson";
import { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@auth0/nextjs-auth0";
import { defaultSeoProps } from "~/config";
import type { AppRouter } from "~/server/routers/_app";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Toaster />
			<DefaultSeo {...defaultSeoProps} />
			<UserProvider>
				<QueryClientProvider client={queryClient}>
					{/* {!isProd && <ReactQueryDevtools />} */}
					<ThemeProvider attribute="class">
						<CustomHead />
						<Component {...pageProps} />
					</ThemeProvider>
				</QueryClientProvider>
			</UserProvider>
		</>
	);
}

function getBaseUrl() {
	if (process.browser) {
		return "";
	}
	// reference for vercel.com
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	// // reference for render.com
	if (process.env.RENDER_INTERNAL_HOSTNAME) {
		return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
	}

	// assume localhost
	return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
	config() {
		return {
			url: `${getBaseUrl()}/api/trpc`,
			transformer: superjson,
		};
	},
	ssr: true,
})(App);
