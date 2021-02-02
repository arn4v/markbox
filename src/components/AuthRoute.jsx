import * as React from "react";
import { useDispatch } from "react-redux";
import { Route, useHistory } from "react-router-dom";
import { useFirebase } from "~/lib/firebase";
import { actions } from "~/store";

const authRoutes = ["/", "/settings"];
/**
 * @param {import("react-router-dom").RouteProps} props
 */
export function AuthRoute(props) {
  const [state, setState] = React.useState({
    loading: true,
    authenticated: false,
    user: null,
  });
  const { auth } = useFirebase();
  const history = useHistory();
  const dispatch = useDispatch();

  React.useEffect(() => {
    (async () => {
      try {
        const user = await new Promise((resolve, reject) => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) resolve(user);
            unsubscribe();
          }, reject);
        });
        if (user) {
          setState((s) => ({
            loading: false,
            authenticated: true,
            user,
          }));
          dispatch({ type: actions.AUTHENTICATE, payload: { user } });
        }
      } catch (err) {
        setState((s) => ({ ...s, loading: false, authenticated: false }));
        history.push("/login");
      }
    })();
  }, [auth, dispatch, history]);

  if (state.loading) return <div className=""></div>;

  return (
    <>
      <Route {...props}></Route>
    </>
  );
}
