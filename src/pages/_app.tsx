import { UserProvider } from "@auth0/nextjs-auth0";
import "@fontsource/inter";
import "@fontsource/poppins";
import { httpLink } from "@trpc/client/links/httpLink";
import { withTRPC } from "@trpc/next";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import "prism-themes/themes/prism-gruvbox-dark.css";
import * as React from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import superjson from "superjson";
import CustomHead from "~/components/CustomHead";
import { defaultSeoProps } from "~/config";
import { getDeploymentUrl } from "~/lib/misc";
import type { AppRouter } from "~/server/routers/_app";
import "~/styles/index.css";

function App({ Component, pageProps }: AppProps) {
	const [queryClient] = React.useState(() => new QueryClient());

	return (
		<>
			<Toaster />
			<DefaultSeo {...defaultSeoProps} />
			<CustomHead />
			<UserProvider>
				<QueryClientProvider client={queryClient}>
					<Component {...pageProps} />
				</QueryClientProvider>
			</UserProvider>
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
