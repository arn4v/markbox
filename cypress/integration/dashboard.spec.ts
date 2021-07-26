describe("When no data exists", () => {
	beforeEach(() => {
		cy.login();
		cy.location("pathname").should("eq", "/dashboard");
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

		cy.get("form[data-test=create-form]").submit();

		cy.location("pathname").should("eq", "/dashboard");

		cy.get("[data-test=bookmark-card]").should("have.length", 1);
	});

	it("Should render delete bookmark modal", () => {
		cy.get("[data-test=bookmark-menu-trigger]").should("exist").click();
		cy.get("[data-test=bookmark-menu-delete]").should("exist").click();
		cy.get("[data-test=modal-root]").should("exist");
	});

	it("Should render close delete bookmark modal on overlay click", () => {
		// Menu button should exist
		cy.get("[data-test=bookmark-menu-trigger]").should("exist").click();

		// Delete button should exist
		cy.get("[data-test=bookmark-menu-delete]").should("exist").click();

		// Modal should exist
		cy.get("[data-test=modal-root]").should("exist");

		// Modal overlay click should close modal
		cy.get("[data-test=modal-overlay]").trigger("click", { force: true });

		// Modal should be closed
		cy.get("[data-test=modal-root]").should("not.exist");
	});

	it("Should delete bookmark", () => {
		// Click menu
		cy.get("[data-test=bookmark-menu-trigger]").should("exist").click();

		// Click delete button in menu
		cy.get("[data-test=bookmark-menu-delete]").should("exist").click();

		// Check if modal has opened
		cy.get("[data-test=modal-root]").should("exist");

		// Click delete button in modal
		cy.get("[data-test=delete-modal-submit]").click();

		// Check if modal has closed
		cy.get("[data-test=modal-root]").should("not.exist");

		cy.reload();

		// Bookmarks should now be 0
		cy.get("[data-test=bookmark-card]").should("have.length", 0);
	});
});
