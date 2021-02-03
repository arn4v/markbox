import * as React from "react";
import { getFirebase } from "~/lib/firebase";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { actions } from "~/store";

const ctx = React.createContext({
  loading: true,
  authenticated: false,
  user: null,
});

const authRoutes = ["/", "/settings"];
export function AuthProvider({ children }) {
  const [state, setState] = React.useState({
    loading: true,
    authenticated: false,
    user: null,
  });
  const { auth } = getFirebase();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setState(() => ({
          loading: false,
          authenticated: true,
          user,
        }));
        dispatch({ type: actions.AUTHENTICATE, payload: { user } });
      } else {
        setState((s) => ({ ...s, loading: false, authenticated: false }));
        if (authRoutes.includes(location.pathname)) history.push("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  if (state.loading) return <div className=""></div>;

  return (
    <>
      <ctx.Provider value={state}>{children}</ctx.Provider>
    </>
  );
}
const useAuth = () => {
  const context = React.useContext(ctx);
  if (!ctx) throw new Error("Use useAuth within the AuthProvider");
  return context;
};
