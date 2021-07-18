import "@fontsource/poppins";
import "@fontsource/inter";
import "prism-themes/themes/prism-gruvbox-dark.css";
import "~/styles/index.css";
import * as React from "react";
import CustomHead from "~/components/CustomHead";
import { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@auth0/nextjs-auth0";
import { defaultSeoProps } from "~/config";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
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
