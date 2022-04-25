// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... });
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... });
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... });
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... });

const slug = (name) => name.toLowerCase().replaceAll(" ", "-");

const compare_document = (expected, actual) => {
	for (const prop in expected) {
		if (expected[prop] instanceof Array) {
			// recursively compare child documents.
			expected[prop].forEach((item, idx) => {
				compare_document(item, actual[prop][idx]);
			});
		} else {
			assert.equal(
				expected[prop],
				actual[prop],
				`${prop} should be equal.`
			);
		}
	}
};

Cypress.Commands.add("go_to_doc", (doctype, name) => {
	cy.visit(`/app/${slug(doctype)}/${encodeURIComponent(name)}`);
});

Cypress.Commands.add("new_doc", (doctype) => {
	cy.visit(`/app/${slug(doctype)}/new`);
});

Cypress.Commands.add("compare_document", (expected_document) => {
	cy.window()
		.its("cur_frm")
		.then((frm) => {
			compare_document(expected_document, frm.doc);
		});
});

Cypress.Commands.add("set_input", (fieldname, fieldtype, value) => {
	cy.get_field(fieldname, fieldtype).clear()
		.type(value, {delay: 200}).wait(1000).type('{enter}');
	return cy.window().its('frappe').then((frappe) => frappe.after_ajax());

});

Cypress.Commands.add("datepicker_pick_today", (fieldname) => {
	cy.get_field(fieldname, 'Date').click();  // Opens calendar
	cy.get('.datepicker.active > .datepicker--buttons > .datepicker--button').click();  // Click on 'Today' on calendar view
});
