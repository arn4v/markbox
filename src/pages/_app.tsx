import { Provider } from "react-redux";
import { store } from "~/store";
import { AuthMiddleware } from "~/middleware/auth";
import "~/styles/index.css";
import "inter-ui/inter.css";
import { ThemeProvider } from "next-themes";
import { AppPropsType } from "next/app";

export default function App({}: AppPropsType) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <AuthMiddleware>
          <Component {...pageProps} />
        </AuthMiddleware>
      </ThemeProvider>
    </Provider>
  );
}
