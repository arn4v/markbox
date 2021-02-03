import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { HomePage } from "./pages/homepage";
import { LoginPage } from "./pages/loginpage";
import { store } from "./store";
import { AuthProvider } from "~/context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
          </Switch>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
