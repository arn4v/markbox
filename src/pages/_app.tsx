import "~/styles/index.css";
import "@reach/dialog/styles.css";
import "inter-ui/inter.css";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import { AuthProvider } from "~/providers/AuthProvider";
import { QueryClientProvider, QueryClient } from "react-query";
import TokenStoreProvider from "~/providers/TokenProvider";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<TokenStoreProvider>
				<AuthProvider>
					<ThemeProvider attribute="class" defaultTheme="dark">
						<Component {...pageProps} />
					</ThemeProvider>
				</AuthProvider>
			</TokenStoreProvider>
		</QueryClientProvider>
	);
}
