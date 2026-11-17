class changePassword {
    elements = {
        passwordInput: () => cy.get('#input-password'),
        passwordConfirm: () => cy.get('#input-confirm'),
        continueButton: () => cy.contains('button[type="submit"]', 'Continue'),
        backButton: () => cy.contains('.btn.btn-light', 'Back')
    };

    enterPassword(password) {
        this.elements.passwordInput().should('be.visible').type(password);
    }

    changePassword(newPassword) {
        this.elements.passwordConfirm().should('be.visible').type(newPassword);
    }

    continueButton() {
        this.elements.continueButton().should('be.visible').click();
    }

    backButton() {
        this.elements.backButton().should('be.visible').click();
    }
}

export default new changePassword();
