/// <reference types="cypress" />

describe("Check homepage", () => {
	it("index page loaded", () => {
		cy.visit("/");
		cy.title().should("include", "Bookmarky");
	});
});
