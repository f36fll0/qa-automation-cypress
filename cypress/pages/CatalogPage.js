class Catalog {
    elements = {
        addToCartButton: (productName, options = {}) => cy.get('.product-thumb', options).contains('a[href*="route=product/product"]', productName).closest('.product-thumb').find('button[formaction*="route=checkout/cart.add"]'),
        cartSummaryButton: () => cy.get('#cart').find('button[type="button"]'),
        viewCart: () => cy.contains('#cart a', 'View Cart'),
        checkout: () => cy.get('[href="http://localhost/index.php?route=checkout/checkout&language=en-gb"] > strong'),
        viewProduct: (productName) => cy.contains('a[href*="product/product"]', productName),
        viewQuantity: (productName) => cy.contains('tr', productName).find('.text-end.text-nowrap'),
        viewPrice: (productName) => cy.contains('tr', productName).find('.text-end').eq(1),
        productCatalogResults: () => cy.get('h4 a[href*="route=product/product"]')
    };

    addToCartButton(productName) {
        this.elements.addToCartButton(productName, { timeout: 10000 }).should('be.visible').click();
    }

    cartSummaryButton() {
        this.elements.cartSummaryButton().should('be.visible').click();
    }

    viewCart() {
        this.elements.viewCart().should('be.visible').click();
    }

    checkout() {
        this.elements.checkout().should('be.visible').click();
    }

    viewProduct(productName) {
        this.elements.viewProduct(productName).should('be.visible');
    }

    viewQuantity(productName) {
        return this.elements.viewQuantity(productName).should('be.visible');
    }

    viewPrice(productName) {
        return this.elements.viewPrice(productName).should('be.visible');
    }

    productCatalogResults() {
        return this.elements.productCatalogResults();
    }
}

export default new Catalog();
