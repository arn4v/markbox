export const logoutIfLoggedIn = (url: string) => {
	if (url.includes("/dashboard")) {
		cy.get("[data-test=profile-dropdown]").click();
		cy.get("[data-test=dashboard-logout-link]").click();
	} else {
		cy.url().should("include", "auth0.com");
	}
};
