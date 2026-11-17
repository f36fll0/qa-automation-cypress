class myWishList {
    elements = {
        camera: () => cy.contains('tr', 'Canon EOS 5D'),
        tablet: () => cy.contains('tr', 'Samsung Galaxy Tab 10.1'),
        cameraAddToCartButton: () => cy.contains('tr', 'Canon EOS 5D').contains('button', 'Add to Cart'),
        tabletAddToCartButton: () => cy.contains('tr', 'Samsung').contains('button', 'Add to Cart'),
        cameraRemoveButton: () => cy.contains('tr', 'Canon EOS 5D').contains('a', 'Remove'),
        tabletRemoveButton: () => cy.contains('tr', 'Samsung').contains('a', 'Remove'),
        continueButton: () => cy.contains('a', 'Continue'),
        whislistLabel: () => cy.xpath('//span[contains(normalize-space(), "Wish List")]')
    };

    checkProduct1() {
        return this.elements.tablet();
    }

    checkProduct2() {
        return this.elements.camera();
    }

    product1Details() {
        return {
            name: 'Samsung Galaxy Tab 10.1',
            model: 'SAM1',
            quantity: 'Pre-Order',
            price: '$241.99'
        };
    }

    product2Details() {
        return {
            name: 'Canon EOS 5D',
            model: 'Product 3',
            quantity: '7',
            price: '$122.00'
        };
    }

    addToCartButton(addCamera, addTablet) {
        if (addCamera) {
            this.elements.cameraAddToCartButton()
                .should('be.visible')
                .click();
        }
        if (addTablet) {
            this.elements.tabletAddToCartButton()
                .should('be.visible')
                .click();
        }
    }

    remove(product1, product2) {
        if (product1 !== 0) {
            this.elements.cameraRemoveButton().should('be.visible').click();
        }
        if (product2 !== 0) {
            this.elements.tabletRemoveButton().should('be.visible').click();
        }
    }

    continueButton() {
        this.elements.continueButton().click();
    }

    clickWhislistLabel() {
        this.elements.whislistLabel().should('be.visible').click();
    }
}

export default new myWishList();
