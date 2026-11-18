class checkout {
    elements = {
        addressRadio: () => cy.get('#input-shipping-existing'),
        address: () => cy.get('#input-shipping-address'),
        addressNewRadio: () => cy.get('#input-shipping-new'),
        shippingMethodCheck: () => cy.get('#button-shipping-methods').contains('Choose'),
        shippingMethodButton: () => cy.get('#button-shipping-method', { timeout: 10000 }).contains('Continue'),
        shippingMethodOption: () => cy.get('#input-shipping-method-flat-flat'),
        payMethodChooseButton: () => cy.get('#button-payment-methods').contains('Choose'),
        payMethodContinueButton: () => cy.get('#button-payment-method', { timeout: 15000 }).contains('Continue'),
        confirmButton: (options = {}) => cy.get('.text-end', options).contains('Confirm Order'),
        viewProduct: () => cy.contains('a[href*="product/product"]'),
        viewQuantity: (productName, quantity) => cy.contains('.table-responsive > .table > tbody > tr', productName).find(':nth-child(1)').should('contain.text', `${quantity}x`),
        viewPrice: (productName) => cy.contains('a[href*="product/product"]', productName).closest('tr').contains('.text-end'),
        firstName: () => cy.get('#input-shipping-firstname'),
        lastName: () => cy.get('#input-shipping-lastname'),
        address1: () => cy.get('#input-shipping-address-1'),
        country: () => cy.get('#input-shipping-country'),
        city: () => cy.get('#input-shipping-city'),
        postCode: () => cy.get('#input-shipping-postcode'),
        region: () => cy.get('#input-shipping-zone'),
        invalidFeedback: () => cy.get('.invalid-feedback.d-block'),
        buttonShippingAddress: () => cy.get('#button-shipping-address'),
        viewTotalPrice: () => cy.get('#checkout-confirm tfoot tr').last().find('td.text-end').last()
    };
    errorMessages = {
        firstname: 'First Name must be between 1 and 32 characters!',
        lastname: 'Last Name must be between 1 and 32 characters!',
        address1: 'Address 1 must be between 3 and 128 characters!',
        city: 'City must be between 2 and 128 characters!',
        region: 'Please select a region / state!'
    };

    chooseAddress() {
        this.elements.addressRadio()
            .should('be.visible')
            .check();
        this.elements.address()
            .should('be.visible')
            .find('option')
            .contains('Fran Lopez')
            .invoke('val')
            .then((value) => {
            this.elements.address().select(value);
        });
    }

    shippingChoose() {
        cy.intercept('GET', '**route=checkout/shipping_method.quote*')
            .as('getShippingQuote');
        cy.intercept('POST', '**route=checkout/shipping_method.save*')
            .as('saveShipping');
        this.elements.shippingMethodCheck()
            .should('be.visible')
            .click();
        cy.wait('@getShippingQuote')
            .its('response.statusCode')
            .should('eq', 200);
        cy.get('#form-shipping-method')
            .find('input[name="shipping_method"]')
            .should('have.length.greaterThan', 0)
            .first()
            .check()
            .should('have.value', 'flat.flat');
        this.elements.shippingMethodButton()
            .should('be.enabled')
            .click();
        return cy.wait('@saveShipping').then(({ response }) => {
            if (!response?.body?.success) {
                return cy.get('#modal-shipping').then(($modal) => {
                    if ($modal.hasClass('show')) {
                        return cy.get('#modal-shipping .btn-close')
                            .click({ force: true })
                            .then(() => false);
                    }
                    return false;
                });
            }
            return cy.get('#modal-shipping')
                .should('not.be.visible')
                .then(() => cy.get('#input-shipping-code')
                .should('have.value', 'flat.flat')
                .then(() => true));
        });
    }

    payMethodChoose() {
        cy.intercept('GET', '**/index.php?route=checkout/payment_method.getMethods*').as('getPaymentMethods');
        cy.intercept('POST', '**/index.php?route=checkout/payment_method.save*').as('savePayment');
        this.elements.payMethodChooseButton()
            .should('be.visible')
            .click();
        cy.wait('@getPaymentMethods').then((interception) => {
            cy.log('Respuesta de métodos de pago: ' +
                JSON.stringify(interception.response?.body));
        });
        this.elements.payMethodContinueButton()
            .should('be.visible')
            .click();
        return cy.wait('@savePayment').then((interception) => {
            const response = interception.response?.body;
            cy.log('Respuesta de pago: ' +
                JSON.stringify(response));
            return cy.get('body').then(($body) => {
                if ($body.find('#modal-payment.show').length) {
                    return cy.get('#modal-payment .btn-close')
                        .click({ force: true });
                }
            });
        });
    }

    confirmOrderButton(click = false) {
        const button = this.elements.confirmButton({ timeout: 15000 });
        if (click) {
            return button.should('be.enabled').click();
        }
        return button;
    }

    viewProduct(productName) {
        this.elements.viewProduct().should('be.visible').and('have.value', productName);
    }

    viewQuantity(productName, quantity) {
        return this.elements.viewQuantity(productName, quantity).should('be.visible');
    }

    viewPrice(productName, price) {
        return this.elements.viewPrice(productName).should('be.visible').and('have.value', price);
    }

    addressFields() {
        this.elements.firstName().should('be.visible').clear();
        this.elements.lastName().should('be.visible').clear();
        this.elements.address1().should('be.visible').clear();
        return this.elements.city().should('be.visible').clear();
    }

    emptyShippingAddressFields(address) {
        if (address.firstName === '') {
            this.elements.firstName()
                .parent()
                .find('.invalid-feedback.d-block')
                .should('contain', this.errorMessages.firstname);
        }
        if (address.lastName === '') {
            this.elements.lastName()
                .parent()
                .find('.invalid-feedback.d-block')
                .should('contain', this.errorMessages.lastname);
        }
        if (address.address1 === '') {
            this.elements.address1()
                .parent()
                .find('.invalid-feedback.d-block')
                .should('contain', this.errorMessages.address1);
        }
        if (address.city === '') {
            this.elements.city()
                .parent()
                .find('.invalid-feedback.d-block')
                .should('contain', this.errorMessages.city);
        }
        if (address.region === ' --- Please Select --- ') {
            this.elements.region()
                .parent()
                .find('.invalid-feedback.d-block')
                .should('contain', this.errorMessages.region);
        }
    }

    buttonShippingAddress() {
        this.elements.buttonShippingAddress().should('be.visible').click();
    }

    addressNewRadio() {
        this.elements.addressNewRadio().should('be.visible').check();
    }

    viewTotalPrice() {
        return this.elements.viewTotalPrice().should('be.visible');
    }

    fillNewShippingAddress(address) {
        this.addressNewRadio();
        if (address.firstname) {
            this.elements.firstName().clear().type(address.firstname);
        }
        if (address.lastname) {
            this.elements.lastName().clear().type(address.lastname);
        }
        if (address.address1) {
            this.elements.address1().clear().type(address.address1);
        }
        if (address.city) {
            this.elements.city().clear().type(address.city);
        }
        if (address.postcode) {
            this.elements.postCode().clear().type(address.postcode);
        }
        if (address.country) {
            this.elements.country().select(address.country);
        }
        if (address.region) {
            this.elements.region().select(address.region);
        }
        this.buttonShippingAddress();
    }
}

export default new checkout();
