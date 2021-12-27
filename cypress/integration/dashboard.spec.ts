import sel from "../selectors";

describe("When no data exists", () => {
	beforeEach(() => {
		cy.login();
		cy.location("pathname").should("eq", "/app");
	});

	it("Should show no data warning", () => {
		cy.get(sel.NO_BOOKMARKS_DATA_WARNING).should("exist");
	});

	it('Should only have "All" tag', () => {
		cy.get(sel.TAG).should("have.length", 1);
		cy.get(sel.TAG).eq(0).contains("All");
	});

	it("Should not show no results warning in Tags List", () => {
		cy.get(sel.NO_TAGS_SEARCH_WARNING).should("not.exist");
	});
});

describe("When a bookmark is added", () => {
	const getSidebarTags = () => cy.get("[data-test=dashboard-tag]");

	beforeEach(() => {
		cy.login();
		cy.location("pathname").should("eq", "/app");
		cy.reload();
	});

	it("Should render create bookmark button", () => {
		cy.get(sel.CREATE_BOOKMARK_BUTTON).should("exist");
	});

	it("Should render create bookmark drawer on button click", () => {
		cy.get(sel.CREATE_BOOKMARK_BUTTON).eq(0).click();
		cy.location("pathname").should("eq", "/create");
	});

	it("Should create a bookmark", () => {
		cy.get(sel.CREATE_BOOKMARK_BUTTON).eq(0).click();
		cy.location("pathname").should("eq", "/create");

		cy.get("input[id=title]").type("Vercel");
		cy.get("input[id=url]").type("https://vercel.com");

		// Adds tag "Dev Tools"
		cy.get("input[id=tag]").type("Dev Tools,");

		// Adds tag "Company"
		cy.get("input[id=tag]").type("Company,");

		cy.get(sel.CREATE_FORM).submit();

		cy.location("pathname").should("eq", "/app");

		cy.get(sel.BOOKMARK_CARD).should("have.length", 1);
	});

	it('Should render "All", "Company" and "Dev Tools" tags in Tags List', () => {
		cy.get(sel.TAG).should("have.length", 3);

		cy.get(sel.TAG).eq(0).invoke("text").should("eq", "All");

		cy.get(sel.TAG).eq(1).invoke("text").should("eq", "Company");

		cy.get(sel.TAG).eq(2).invoke("text").should("eq", "Dev Tools");
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
		cy.get().should("have.length", 2);

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
