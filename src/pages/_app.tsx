import "inter-ui/inter.css";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import "prism-themes/themes/prism-gruvbox-dark.css";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { defaultSeoProps, isProd } from "~/config";
import "~/styles/index.css";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<DefaultSeo {...defaultSeoProps} />
			{!isProd && <ReactQueryDevtools />}
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				enableSystem={false}
				enableColorScheme={false}
			>
				<Component {...pageProps} />
			</ThemeProvider>
		</QueryClientProvider>
	);
}
