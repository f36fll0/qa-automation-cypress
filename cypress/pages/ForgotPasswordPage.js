class ForgotPassword {
    elements = {
        emailAdressInput: () => cy.get('#input-email'),
        continueButton: () => cy.contains('Continue'),
        backButton: () => cy.contains('Back')
    };

    visit() {
        cy.visit('http://localhost/index.php?route=account/forgotten&language=en-gb');
    }

    recoverPassword(email) {
        this.elements.emailAdressInput().type(email);
        this.elements.continueButton().should('be.visible').click();
    }

    backLogin() {
        this.elements.backButton().should('be.visible').click();
    }
}

export default new ForgotPassword();
