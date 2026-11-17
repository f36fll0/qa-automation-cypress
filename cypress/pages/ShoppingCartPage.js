class shoppingCart {
    elements = {
        product: () => cy.get('.text-start.text-wrap'),
        quantity: (productName) => cy.contains('#output-cart .text-start.text-wrap', productName).closest('tr').find('input[name="quantity"]'),
        updateQuantity: (productName) => cy.contains('#output-cart .text-start.text-wrap', productName).closest('tr').find('.fa-solid.fa-rotate'),
        removeQuantity: (productName) => cy.contains('#output-cart .text-start.text-wrap', productName).closest('tr').find('a[href*="route=checkout/cart.remove"]'),
        totalPrice: () => cy.get('#checkout-total').find('tr').last().find('td.text-end').eq(1),
        checkoutButton: () => cy.contains('a.btn-primary', 'Checkout'),
        updateButton: (productName) => cy.contains('#output-cart .text-start.text-wrap', productName).closest('tr').find('.btn-primary > .fa-solid')
    };

    product(productName) {
        return cy.contains('#output-cart .text-start.text-wrap a', productName);
    }

    quantity(productName, quantity) {
        this.elements.quantity(productName).should('be.visible').and('have.value', quantity);
    }

    updateQuantity(productName, updateQuantity) {
        cy.intercept('POST', '**route=checkout/cart.edit*').as('updateCart');
        this.elements.quantity(productName).should('be.visible').clear().type(updateQuantity);
        this.elements.updateButton(productName).should('be.visible').click();
        return cy.wait('@updateCart').its('response.statusCode').should('eq', 200);
    }

    removeQuantity(productName) {
        return this.elements.removeQuantity(productName).should('be.visible').click();
    }

    checkoutButton() {
        this.elements.checkoutButton().should('be.visible').click();
    }

    getTotalPrice() {
        cy.intercept('GET', '**route=common/cart.info*').as('price');
        return cy.wait('@price')
            .its('response.statusCode')
            .should('eq', 200)
            .then(() => {
            return this.elements.totalPrice()
                .invoke('text')
                .then((text) => text.trim());
        });
    }

    totalPrice(productName, price) {
        this.elements.totalPrice(productName).should('be.visible').and('contain.text', price);
    }

    updatePrice(productName) {
        return this.elements.totalPrice(productName).should('be.visible');
    }
}

export default new shoppingCart();
