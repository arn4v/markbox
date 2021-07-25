export const visitLogin = () => {
	cy.visit("/");
	cy.get("[data-test=homepage-get-started-link]").click();
};
