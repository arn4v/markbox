import { login } from "./login";
import { visitHome } from "./visit-home";
import { visitLogin } from "./visit-login";

declare global {
	namespace Cypress {
		interface Chainable {
			login: typeof login;
			visitLoginPage: typeof visitLogin;
			visitHome: typeof visitHome;
		}
	}
}

Cypress.Commands.add("visitLoginPage", visitLogin);
Cypress.Commands.add("visitHome", visitHome);
Cypress.Commands.add("login", login);
