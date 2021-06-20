import * as React from "react";
import { useLocalStorage } from "react-use";

interface TokenStoreContext {
  accessToken: string;
  setAccessToken: (token: string) => void;
}

interface TokenStoreProviderProps {
  children: React.ReactNode;
}

const context = React.createContext<TokenStoreContext>({
  accessToken: undefined,
  setAccessToken: undefined,
});

export default function TokenStoreProvider({
  children,
}: TokenStoreProviderProps) {
  const [accessToken, setAccessToken] = useLocalStorage<string>("access_token");

  return (
    <context.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </context.Provider>
  );
}

export const useTokenStore = () => React.useContext(context);
