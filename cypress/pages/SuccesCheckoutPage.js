class succesCheckout {
    elements = {
        tittle: (options = {}) => cy.contains('h1', 'Your order has been placed!', options),
        continueButton: () => cy.get('.btn.btn-primary').contains('a', 'Continue')
    };

    checktittle() {
        this.elements.tittle({ timeout: 15000 }).should('be.visible');
    }

    continueButton() {
        this.elements.continueButton().should('be.visible',).click();
    }
}

export default new succesCheckout();
