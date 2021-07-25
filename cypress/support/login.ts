export const login = () => {
	cy.visit("/");

	cy.get("[data-test=homepage-login-link]").click();

	cy.url().should("include", "auth0.com");

	// Fill username (email)
	cy.get("input#username").focus().type("test@bookmarky.io");

	// Fill password
	cy.get("input#password").focus().type("CTkJEk5s+-9naqA");

	cy.get("button[value=default]").click();
};
