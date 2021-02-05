import * as React from "react";
import { getFirebase } from "~/lib/firebase";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { actions } from "~/store";

const authRoutes = ["/", "/settings"];
export function AuthProvider({ children }) {
  const [state, setState] = React.useState({
    loading: true,
    authenticated: false,
    user: null,
  });
  const { auth } = getFirebase();
  const router = useRouter();
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
        if (authRoutes.includes(location.pathname)) router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, dispatch, router, router.pathname]);

  if (state.loading) return <div className=""></div>;

  return <>{children}</>;
}
