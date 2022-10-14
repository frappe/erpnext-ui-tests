context('Fetching Terms and Conditions in Quotation', () => {
	before(() => {
		cy.login();
	});

	it('Check terms and condition fetched in quotation', () => {
		cy.new_doc('Quotation');
		cy.location('pathname').should('include', '/app/quotation/new-quotation');

		cy.get_select('naming_series').should('have.value', 'SAL-QTN-.YYYY.-');
		cy.get_input('transaction_date').should('not.have.value', 0);
		cy.get_input('quotation_to').should('have.value', 'Customer');
		cy.get_input('valid_till').should('not.have.value', 0);
		cy.get_input('party_name').click();
		cy.wait(600);
		cy.set_link('party_name', 'William Harris');
		cy.get_select('order_type').should('have.value', 'Sales');
		cy.get_read_only('customer_name').should('contain', 'William Harris');

		//cy.open_section('Address and Contact');
		cy.findByRole("tab", { name: "Address & Contact" }).click();
		cy.get_read_only('customer_address').should('contain', "William's Address-Billing");
		cy.get_read_only('shipping_address_name').should('contain', "William's Address-Billing");
		cy.findByRole("tab", { name: "More Info" }).click();
		cy.click_section_head('additional_info_section');
		cy.get_read_only('territory').should('contain', 'All Territories');

		cy.click_tab('Details');
		cy.set_link('items.item_code', 'Apple iPhone 13 Pro Max');
		cy.get_input('qty').should('have.value', "1.000");
		cy.get_input('rate').clear();
		cy.set_input('rate', '110000');
		cy.get_input('rate').blur();
		cy.get_read_only('amount').should('contain', '1,10,000.00');

		cy.get_read_only('total_qty').should('contain', "1");
		cy.get_read_only('total').should('contain', "₹ 1,10,000.00");
		cy.get_read_only('grand_total').should('contain', "₹ 1,10,000.00");
		cy.get_read_only('rounded_total').should('contain', "₹ 1,10,000.00");

		cy.click_tab('Terms');
		cy.findByText('Terms and Conditions').scrollIntoView().should('be.visible');
		cy.click_section('Terms and Conditions');
		cy.set_link('tc_name', 'Standard Terms and Condition');
		//cy.get_field('terms', 'Text Editor').should('not.have.value', 0);
		cy.get_field('terms', 'Text Editor').invoke('text').should('match', /This is a sample term and conditions text/);

		cy.click_toolbar_button('Save');
		cy.get_page_title().should('contain', 'Draft');
		cy.click_toolbar_button('Submit');
		cy.click_modal_primary_button('Yes');
		cy.get_page_title().should('contain', 'Open');
	});
});
