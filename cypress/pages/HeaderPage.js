class header {
    elements = {
        cart: () => cy.contains('a', 'Shopping Cart'),
        myAccountLabel: () => cy.get('.dropdown', { timeout: 6000 }),
        openCartLogo: () => cy.get('a:has(img[title="Your Store"])'),
        inputSearch: () => cy.get('input[name="search"]'),
        searchButton: () => cy.get('form[action*="route=common/search"]').find('button[type="submit"]'),
        componentLabel: () => cy.get('a[href*="route=product/category"].nav-link.dropdown-toggle').contains('Components'),
        showAllComponentsLabel: () => cy.contains('a', 'Show All Components')
    };

    goToShoppingCart() {
        this.elements.cart().should('be.visible').click();
    }

    clickMyAccount() {
        this.elements.myAccountLabel().contains('a.dropdown-toggle', 'My Account').click();
        this.elements.myAccountLabel().contains('a.dropdown-item', 'My Account').click();
    }

    openCartLogo() {
        this.elements.openCartLogo().should('be.visible').click();
    }

    inputSearch(productName) {
        this.elements.inputSearch().should('be.visible').type(productName);
    }

    searchButton() {
        this.elements.searchButton().should('be.visible').click();
    }

    components() {
        this.elements.componentLabel().should('be.visible').click();
    }

    showAllComponents() {
        this.elements.showAllComponentsLabel().should('be.visible').click();
    }
}

export default new header();
