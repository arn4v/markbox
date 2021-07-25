describe("When no bookmarks exist", () => {
	before(() => {
		cy.visitHome();
		cy.login();
	});

	it("Should show no data warning", () => {
		cy.find("[data-test=dashboard-no-warning");
	});
});

describe("When no tags exist", () => {
	before(() => {
		cy.visitHome();
		cy.login();
	});

	it('Should only have "All" tag', () => {
		cy.get("[data-test=dashboard-tag]").should("have.length", 1);
		cy.get("[data-test=dashboard-tag]").eq(0).contains("All");
	});
});
