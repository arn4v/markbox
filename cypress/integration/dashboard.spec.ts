describe("When no data exists", () => {
	before(() => {
		cy.visit("/");
		cy.login();
	});

	it("Should show no data warning", () => {
		cy.get("[data-test=dashboard-no-data-warning]");
	});

	it('Should only have "All" tag', () => {
		cy.get("[data-test=dashboard-tag]").should("have.length", 1);
		cy.get("[data-test=dashboard-tag]").eq(0).contains("All");
	});
});

describe("When some data is added", () => {
	beforeEach(() => {
		cy.login();
		cy.location("pathname").should("eq", "/dashboard");
	});

	it("Should render create bookmark button", () => {
		cy.get("[data-test=create-bookmark-button]").should("exist");
	});

	it("Should render create bookmark drawer on button click", () => {
		cy.get("[data-test=create-bookmark-button]").eq(0).click();
		cy.location("pathname").should("eq", "/create");
	});

	it("Should create a bookmark", () => {
		cy.get("[data-test=create-bookmark-button]").eq(0).click();
		cy.location("pathname").should("eq", "/create");

		cy.get("input[id=title]").type("Vercel");
		cy.get("input[id=url]").type("https://vercel.com");

		// Adds tag "Dev Tools"
		cy.get("input[id=tag]").type("Dev Tools,");

		// Adds tag "Company"
		cy.get("input[id=tag]").type("Company,");

		cy.get("[data-test=create-root] > form").submit();
	});
});
