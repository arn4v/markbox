describe.skip("When logging in", () => {
	it("should show dashboard button if logged in", () => {
		cy.get("[data-test=homepage-get-started-link]")
			.click()
			.url()
			.should("include", "auth0.com");
	});

	it("should redirect to auth0, login and redirect to dashboard", () => {
		// Go to login page
		cy.visit("/").get("[data-test=homepage-get-started-link]").click();

		// Fill username (email)
		cy.get("input#username").focus().type("test@bookmarky.io");

		// Fill password
		cy.get("input#password").focus().type("CTkJEk5s+-9naqA");

		cy.get("button[value=default]").click();

		cy.wait(3000);

		cy.location("pathname").should("eq", "/dashboard");
	});

	it("logs out and redirects to homepage", () => {
		cy.get("[data-test=profile-dropdown]")
			.click()
			.get("[data-test=dropdown-logout-link]")
			.click();

		cy.wait(3000);

		cy.location("pathname").should("eq", "/");
	});
});
