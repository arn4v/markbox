import { login } from "./login";
import { logoutIfLoggedIn } from "./logout-if-logged-in";
import { visitHome } from "./visit-home";
import { visitLogin } from "./visit-login";

declare global {
	namespace Cypress {
		interface Chainable {
			login: typeof login;
			logoutIfLoggedIn: typeof logoutIfLoggedIn;
			visitLoginPage: typeof visitLogin;
			visitHome: typeof visitHome;
		}
	}
}

Cypress.Commands.add("visitLoginPage", visitLogin);
Cypress.Commands.add("logoutIfLoggedIn", logoutIfLoggedIn);
Cypress.Commands.add("visitHome", visitHome);
Cypress.Commands.add("login", login);
