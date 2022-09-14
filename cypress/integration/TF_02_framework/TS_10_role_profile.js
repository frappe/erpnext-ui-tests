context('Role Profile', () => {
    before(() => {
        cy.login();
        cy.go_to_list('Website');
    });

    it('Creates new role profile', () => {
		//Creating role profile
		cy.new_doc('Role Profile');
		cy.set_input('role_profile', 'Test RoleProfile');
		cy.save();
		cy.wait(2000);
		cy.get('.select-all').click({force: true, scrollBehavior: false});
		cy.save();

		//Creating a new user using the created role profile
		cy.get('.form-dashboard-section .form-documents .document-link').should('contain', 'User');
		cy.get('.form-dashboard-section .form-documents .document-link button')
			.should('have.class', 'icon-btn').click({force: true, scrollBehavior: false});
		cy.findByRole('button', {name: 'Edit Full Form'}).scrollIntoView().click();
		cy.get('.modal-actions button.btn-modal-close').click({force: true, multiple: true});
		cy.fill_field('email', 'test_role_user@exapmle.com', 'Data');
		cy.fill_field('first_name', 'Test Role User', 'Data');
		cy.get_field('send_welcome_email', 'Check').uncheck({force: true});
		cy.save();

		//Checking if the roles selected in role profile is also checked in the user
		cy.go_to_list('User');
		cy.list_open_row('Test Role User');
		cy.findByRole("tab", { name: "Roles & Permissions" }).click();
		cy.get_input('role_profile_name').should('have.value', 'Test RoleProfile');
		cy.get_input('roles').should('be.checked');
	});

	it('New user', () => {
		//Creating a new user and using the role profile created
		cy.new_doc('User');
		cy.set_input('email', 'test_role_user123@exapmle.com');
		cy.set_input('first_name', 'Test Role User123');
		cy.get_field('send_welcome_email', 'Check').uncheck();
		cy.save();
		cy.wait(1000);
		cy.findByRole("tab", { name: "Roles & Permissions" }).click();
		cy.get_field('role_profile_name', 'Link').click({force: true, scrollBehavior: false});
		cy.get('[data-fieldname="role_profile_name"] ul:visible li:first-child')
			.should('contain', 'Test RoleProfile')
			.click({force:true});	
		cy.get_input('roles').should('be.checked');
	});

	it('Creating a new role profile with minimum roles and creating user using it', () => {
		//Creating a new role profile with minimum roles assigned
		cy.new_doc('Role Profile');
		cy.set_input('role_profile', 'Test RoleProfile1');
		cy.save();
		cy.wait(1000);
		cy.get('.checkbox-options [type="checkbox"][data-unit="System Manager"]:visible').check();
		cy.get('.checkbox-options [type="checkbox"][data-unit="Sales Manager"]:visible').check();
		cy.save();

		//Creating a new user using the created role profile
		cy.get('.form-dashboard-section .form-documents .document-link').should('contain', 'User');
		cy.new_doc('User');
		cy.set_input('email', 'test_rle_user@example.com');
		cy.set_input('first_name', 'TestRole User');
		cy.get_field('send_welcome_email', 'Check').uncheck();
		cy.save();
		cy.wait(1000);

		//Checking if the roles selected in role profile is also checked in the user
		cy.findByRole("tab", { name: "Roles & Permissions" }).click();
		cy.get_field('role_profile_name', 'Link').click({force: true, scrollBehavior: false});
		cy.get('[data-fieldname="role_profile_name"] ul:visible li')
			.should('contain', 'Test RoleProfile1');
		cy.set_link('role_profile_name', 'Test RoleProfile1');	
		cy.get('.role-editor [type="checkbox"][data-unit="System Manager"]:visible').should('be.checked');
		cy.get('.role-editor [type="checkbox"][data-unit="Sales Manager"]:visible').should('be.checked');
	});
});