import "~/styles/index.css";
import "@reach/dialog/styles.css";
import "inter-ui/inter.css";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { isProd } from "~/constants";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			{!isProd && <ReactQueryDevtools />}
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				themes={["light", "dark"]}>
				<Component {...pageProps} />
			</ThemeProvider>
		</QueryClientProvider>
	);
}
