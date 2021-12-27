describe("When not authenticated", () => {
	beforeEach(() => {
		cy.clearCookies().clearLocalStorage();
		cy.visit("/api/auth/logout");
		cy.wait(1500);
	});

	it("should redirect to homepage", () => {
		cy.visit("/app").location("pathname").should("eq", "/");
	});

	it("should show login, signup and get started button if not logged in", () => {
		cy.visit("/");

		cy.get("[data-test=homepage-login-link]")
			.should("have.attr", "href")
			.should("equal", "/api/auth/login");

		cy.get("[data-test=homepage-signup-link]")
			.should("have.attr", "href")
			.should("equal", "/api/auth/signup");

		cy.get("[data-test=homepage-get-started-link]")
			.should("have.attr", "href")
			.should("equal", "/api/auth/login");
	});
});
