describe("When logging in", () => {
	before(() => {
		cy.visitHome();
	});

	it("should redirect to auth0", () => {
		cy.get("[data-test=homepage-get-started-link]")
			.click()
			.url()
			.then(($url) => {
				cy.logoutIfLoggedIn($url);
			})
			.should("include", "auth0.com");
	});

	it.skip("should show dashboard button if logged in", () => {
		// Todo
	});

	it("should redirect to auth0, login and redirect to dashboard", () => {
		cy.visit("/");

		cy.get("[data-test=homepage-get-started-link]").click();

		cy.url().then(($url) => {
			cy.logoutIfLoggedIn($url);
			cy.login();

			cy.wait(3000);

			cy.url().should("include", "/dashboard");
		});
	});

	it("logs out and redirects to homepage", () => {
		cy.visit("/dashboard");
		cy.location("pathname").should("eq", "/dashboard");

		cy.get("[data-test=profile-dropdown]")
			.click()
			.get("[data-test=dropdown-logout-link]")
			.click();

		cy.wait(3000);

		cy.location("pathname").should("eq", "/");
	});
});
