export const login = () => {
	cy.visit("/");

	cy.get("[data-test=homepage-get-started-link]").click();

	cy.url().then((url) => {
		if (url.includes("auth0.com")) {
			// Fill username (email)
			cy.get("input#username").focus().type("test@markbox.in");

			// Fill password
			cy.get("input#password").focus().type("CTkJEk5s+-9naqA");

			cy.get("button[value=default]").click();
		}
	});
};
