export const visitHome = () => {
	cy.clearCookies();
	cy.clearLocalStorage();
	cy.visit("/api/auth/logout");
	cy.visit("/");
};
