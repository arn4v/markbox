import { UserProvider } from "@auth0/nextjs-auth0";
import "inter-ui/inter.css";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import "prism-themes/themes/prism-gruvbox-dark.css";
import * as React from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import CustomHead from "~/components/CustomHead";
import { defaultSeoProps } from "~/config";
import "~/styles/index.css";

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
