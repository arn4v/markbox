import "~/styles/index.css";
import "inter-ui/inter.css";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
