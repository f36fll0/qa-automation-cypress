class productCategory {
    elements = {
        tablets: () => cy.contains('.list-group-item', 'Tablets (1)'),
        cameras: () => cy.contains('.list-group-item', 'Cameras (2)'),
        wishlistTablet: () => cy.get('[formaction="http://localhost/index.php?route=account/wishlist.add&language=en-gb"]'),
        wishlistCamera: () => cy.get('#product-list').contains('a', 'Canon EOS 5D').closest('.product-thumb').find('button[formaction*="wishlist.add"]'),
        myAccountLabel: () => cy.get('.dropdown'),
        desktops: () => cy.get('#product-category a[href*="path=20"]'),
        inputLimit: () => cy.get('#input-limit'),
        productCatalogResults: () => cy.get('h4 a[href*="route=product/product"]'),
        inputshort: () => cy.get('#input-sort'),
        productPriceList: () => cy.get('.product-thumb .price-new')
    };

    visit() {
        cy.visit('http://localhost/index.php?route=product/category&language=en-gb&path=25');
    }

    clickTablets() {
        this.elements.tablets().should('be.visible').click();
    }

    clickWhiListTable() {
        this.elements.wishlistTablet().should('be.visible').click();
    }

    clickCameras() {
        this.elements.cameras().should('be.visible').click();
    }

    clickWhiListCamera() {
        this.elements.wishlistCamera().should('be.visible').click();
    }

    inputLimit() {
        this.elements.inputLimit().should('be.visible').select('100');
    }

    desktops() {
        this.elements.desktops().should('be.visible').click();
    }

    productCatalogResults() {
        return this.elements.productCatalogResults();
    }

    selectProduct(productName) {
        cy.contains('h4 a[href*="route=product/product"]', productName).should('be.visible').click();
    }

    inputShortRisingPrice() {
        this.elements.inputshort().should('be.visible').select('Price (Low > High)');
    }

    inputShortRisingName() {
        this.elements.inputshort().should('be.visible').select('Name (A - Z)');
    }

    priceList() {
        return this.elements.productPriceList().should('exist');
    }
}

export default new productCategory();
