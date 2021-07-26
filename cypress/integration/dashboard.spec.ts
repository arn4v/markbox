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
		cy.reload();
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

	it("Should open edit drawer", () => {
		// Menu button should exist
		cy.get("[data-test=bookmark-menu-trigger]").should("exist").click();

		// Edit button should exist
		cy.get("[data-test=bookmark-menu-edit]").should("exist").click();

		// Drawer should be open
		cy.get("[data-test=drawer]").should("exist");
	});

	it("Should close edit drawer on overlay click", () => {
		// Menu button should exist
		cy.get("[data-test=bookmark-menu-trigger]").eq(0).should("exist").click();

		cy.get("[data-test=bookmark-menu-edit]").should("exist").click();

		// Modal should exist
		cy.get("[data-test=drawer]").should("exist");

		// Modal overlay click should close modal
		cy.get("[data-test=drawer-overlay]").trigger("click", {
			force: true,
		});

		// Modal should be closed
		cy.get("[data-test=drawer-root]").should("not.exist");
	});

	it("Should edit bookmark title and url", () => {
		// Menu button should exist
		cy.get("[data-test=bookmark-menu-trigger]").eq(0).should("exist").click();

		cy.get("[data-test=bookmark-menu-edit]").should("exist").click();

		// Modal should exist
		cy.get("[data-test=drawer]").should("exist");

		cy.get("[data-test=edit-title]").clear().type("Netlify");

		cy.get("[data-test=edit-url]").clear().type("https://netlify.com");

		cy.get("[data-test=edit-submit]").click();

		cy.reload();

		cy.get("[data-test=bookmark-title]").invoke("text").should("eq", "Netlify");

		cy.get("[data-test=bookmark-url]")
			.invoke("text")
			.should("eq", "https://netlify.com");

		cy.get("[data-test=bookmark-url]")
			.should("have.attr", "href")
			.should("eq", "https://netlify.com");
	});

	it("Should remove Company tag from bookmark", () => {
		cy.get("[data-test=tag-badge]").should("have.length", 2);

		cy.get("[data-test=bookmark-menu-trigger]").eq(0).should("exist").click();

		cy.get("[data-test=bookmark-menu-edit]").should("exist").click();

		// Modal should exist
		cy.get("[data-test=drawer]").should("exist");

		cy.get("[data-test=edit-tag-badge]").should("have.length", 2);

		cy.get("[data-test=edit-tag-delete]").eq(0).click();

		cy.get("[data-test=edit-tag-badge]")
			.should("have.length", 1)
			.eq(0)
			.invoke("text")
			.should("eq", "Dev Tools");

		cy.get("[data-test=edit-form").submit();

		cy.reload();

		cy.get("[data-test=tag-badge")
			.should("have.length", 1)
			.invoke("text")
			.should("eq", "Dev Tools");
	});

	it("Should delete bookmark", () => {
		// Click menu
		cy.get("[data-test=bookmark-menu-trigger]").should("exist").click();

		// Click delete button in menu
		cy.get("[data-test=bookmark-menu-delete]").should("exist").click();

		// Check if modal has opened
		cy.get("[data-test=modal-root]").should("exist");

		// Click delete button in modal
		cy.get("[data-test=delete-modal-submit-button]").click();

		// Check if modal has closed
		cy.get("[data-test=modal-root]").should("not.exist");

		cy.reload();

		// Bookmarks should now be 0
		cy.get("[data-test=bookmark-card]").should("have.length", 0);
	});
});
