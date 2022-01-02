import { UserProvider } from "@auth0/nextjs-auth0";
import "@fontsource/inter";
import "@fontsource/poppins";
import { withTRPC } from "@trpc/next";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import "prism-themes/themes/prism-gruvbox-dark.css";
import * as React from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import superjson from "superjson";
import CustomHead from "~/components/CustomHead";
import { defaultSeoProps } from "~/config";
import type { AppRouter } from "~/server/routers/_app";
import "~/styles/index.css";

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
