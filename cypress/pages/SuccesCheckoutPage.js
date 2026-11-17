class succesCheckout {
    elements = {
        tittle: () => cy.contains('h1', 'Your order has been placed!'),
        continueButton: () => cy.get('.btn.btn-primary').contains('a', 'Continue')
    };

    checktittle() {
        this.elements.tittle().should('be.visible');
    }

    continueButton() {
        this.elements.continueButton().should('be.visible').click();
    }
}

export default new succesCheckout();
