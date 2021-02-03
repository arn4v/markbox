import * as React from "react";
import { createUserDoc } from "~/lib/db";
import clsx from "clsx";
import { useHistory } from "react-router-dom";
import { getFirebase } from "~/lib/firebase";
import { useDispatch } from "react-redux";
import { actions } from "~/store";

export function LoginPage() {
  const [state, setState] = React.useState({
    email: "",
    password: "",
    error: { show: false, message: "" },
  });
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth } = getFirebase();
  const login = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(state.email, state.password)
      .then((res) => {
        const { user } = res;
        if (user) {
          createUserDoc({ user });
          dispatch({ type: actions.AUTHENTICATE, payload: { user } });
          history.push("/");
        }
      })
      .catch((err) => {
        if (err) {
          setState((s) => ({
            ...s,
            error: { show: true, message: err.toString() },
          }));
        }
      });
  };

  const reset = () => {
    setState((s) => ({ ...s, error: { show: false, message: undefined } }));
  };
  const onChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  return (
    <div className="items-center justify-center h-screen w-screen overflow-hidden bg-blueGray-800">
      <div className="grid w-4/5 grid-flow-row gap-6 lg:w-1/5">
        <button
          className="flex items-center gap-2 px-1 py-0.5 rounded-md focus:outline-none font-medium text-white transition duration-150 ease-out justify-self-start hover:bg-gray-700"
          onClick={() => history.push("/")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 text-white stroke-2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
          Homepage
        </button>
        <form onSubmit={login} className="flex flex-col w-full gap-4">
          <div className="input-wrapper">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={onChange}
              className={clsx([
                "input",
                { "border-red-500": state.error.show },
              ])}
              v-model="email"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              name="password"
              onChange={onChange}
              type="password"
              className="input"
            />
          </div>
          <button
            type="submit"
            className="p-3 mt-2 text-lg font-medium text-white uppercase rounded-lg bg-emerald-400 focus:outline-none">
            Login
          </button>
        </form>
        {state.error.show && (
          <div className="flex items-center justify-between p-3 text-white bg-red-500 rounded-lg">
            <div className="w-full text-sm">{state.error.message}</div>
            <button
              className="p-1 transition duration-150 ease-in-out rounded-full hover:bg-red-400 focus:outline-none"
              onClick={reset}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
