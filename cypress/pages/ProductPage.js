class product {
    elements = {
        productName: () => cy.get('h1'),
        model: () => cy.get('#input-option-226'),
        quantity: () => cy.get('#input-quantity'),
        addToCart: () => cy.get('#button-cart'),
        price: () => cy.get('.price-new')
    };

    checkProduct() {
        return this.elements.productName().should('be.visible').invoke('text').then((text) => text.trim());
    }

    selectModel(colour) {
        this.elements.model().select(colour);
    }

    selectQuantity(quantity) {
        this.elements.quantity().clear().type(quantity);
    }

    addToCart() {
        this.elements.addToCart().should('be.visible').click();
    }

    price() {
        return this.elements.price().should('be.visible');
    }
}

export default new product();
