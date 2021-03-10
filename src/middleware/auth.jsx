import * as React from "react";
import { getFirebase } from "~/lib/firebase";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { actions } from "~/store";

const authRoutes = ["/dashboard", "/settings"];

export function AuthMiddleware({ children }) {
  const { auth } = getFirebase();
  const router = useRouter();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch({ type: actions.AUTHENTICATE, payload: user });
      } else {
        if (authRoutes.includes(location.pathname)) router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, dispatch, router, router.pathname]);

  return <>{children}</>;
}
