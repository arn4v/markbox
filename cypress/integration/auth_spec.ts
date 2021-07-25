/// <reference types="cypress" />

describe("When not authenticated", () => {
	beforeEach(() => {
		cy.clearCookies().clearLocalStorage();
		cy.visit("/api/auth/logout");
		cy.wait(1500);
	});

	it("should redirect to homepage", () => {
		cy.visit("/dashboard").location("pathname").should("eq", "/");
	});

	it("should show login, signup and get started button if not logged in", () => {
		cy.visit("/");

		cy.viewport(1920, 1080);

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

describe("When trying to authenticate", () => {
	beforeEach(() => {
		cy.clearCookies().clearLocalStorage();
		cy.visit("/api/auth/logout");
		cy.wait(1500);
	});

	it("should show dashboard button if logged in", () => {
		cy.get("[data-test=homepage-get-started-link]")
			.click()
			.url()
			.should("include", "auth0.com");
	});
});

describe("When logging in", () => {
	before(() => {
		cy.clearCookies().clearLocalStorage();
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
});
