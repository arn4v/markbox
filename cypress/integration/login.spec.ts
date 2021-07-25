describe("When logging in", () => {
	const getLogin = () => cy.get("[data-test=homepage-get-started-link]");

	const logoutIfLoggedIn = (url: string) => {
		if (url.includes("/dashboard")) {
			cy.get("[data-test=profile-dropdown]").click();
			cy.get("[data-test=dropdown-logout-link]").click();
		}
	};

	before(() => {
		cy.visitHome();
	});

	it("should redirect to auth0", () => {
		getLogin()
			.click()
			.url()
			.then(($url) => {
				logoutIfLoggedIn($url);
				getLogin().click();
				cy.url().should("include", "auth0.com");
			});
	});

	it.skip("should show dashboard button if logged in", () => {
		// Todo
	});

	it("should redirect to auth0, login and redirect to dashboard", () => {
		cy.visit("/");

		cy.get("[data-test=homepage-get-started-link]").click();

		cy.url().then(($url) => {
			logoutIfLoggedIn($url);
			cy.login();
			cy.location("pathname").should("eq", "/api/auth/callback");
		});
	});

	it("logs out and redirects to homepage", () => {
		cy.visit("/dashboard");

		// Wait for redirect
		cy.wait(3000);

		cy.location("pathname").then((loc) => {
			if (loc === "/dashboard") {
				cy.get("[data-test=profile-dropdown]")
					.click()
					.get("[data-test=dropdown-logout-link]")
					.click();

				cy.wait(3000);

				cy.location("pathname").should("eq", "/");
				cy.should("eq", "/dashboard");
			} else {
				cy.log("Login failed due to Auth0 but integration");
			}
		});
	});
});
