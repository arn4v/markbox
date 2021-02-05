import { Provider } from "react-redux";
import { store } from "~/store";
import { AuthProvider } from "~/context/AuthContext";

/** @param {import("next/app").AppProps} props */
export default function App(props) {
  const { Component, pageProps } = props;
  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </Provider>
    </>
  );
}
