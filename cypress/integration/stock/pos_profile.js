context('Create POS Profile', () => {
    before(() => {
    cy.login();
        });

			//Set mode of payment first
			it('Sets appropriate account for mode of payment', () => {
			cy.visit('app/mode-of-payment/Wire%20Transfer');
			cy.get_grid_edit();
			cy.set_link('accounts.company', 'Wind Power LLC');
			cy.set_link('accounts.default_account', 'Cash - WP');
			cy.wait(500);
			cy.save();
		});

        	it.only('Create POS Profile', () => {
            cy.visit(`app/pos-profile`);
            cy.wait(200);
            cy.click_listview_primary_button('Add POS Profile');
            cy.location("pathname").should("eq","/app/pos-profile/new-pos-profile-1");
            cy.set_input('__newname', 'Test Profile');
			cy.get_input('__newname', 'Data').should('have.value', 'Test Profile');
			cy.set_link('warehouse', 'Stores - WP');
			cy.get_field('warehouse', 'Link').should('have.value', 'Stores - WP');

			//SeleWP Mode of Payment
			cy.get_grid_edit();
			cy.get_field('default', 'Check').check();
			cy.get_field('default', 'checkbox').should('be.checked');
			cy.set_link('payments.mode_of_payment', 'Wire Transfer');
			cy.get_field('mode_of_payment', 'Link').should('have.value', 'Wire Transfer');
			cy.get('.grid-collapse-row').click();

			//Set POS Configurations
			cy.get_field('allow_rate_change').check();
			cy.get_field('allow_rate_change', 'checkbox').should('be.checked');
			cy.get_field('allow_discount_change').check();
			cy.get_field('allow_discount_change', 'checkbox').should('be.checked');

			//SeleWP Item Group

			//Set necessary accounts
			cy.set_link('write_off_account', 'Write Off - WP');
			cy.get_field('write_off_account', 'Link').should('have.value', 'Write Off - WP');
			cy.set_link('write_off_cost_center', 'Main - WP');
			cy.get_field('write_off_cost_center', 'Link').should('have.value', 'Main - WP');
			cy.set_select('apply_discount_on', 'Grand Total');
            cy.save();
			cy.get_input('selling_price_list', 'Link').should('have.value', 'Standard Selling');
			cy.location("pathname").should("not.be","/app/pos-profile/new-pos-profile-1");
        });
    });
