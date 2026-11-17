class LoginPage {
    elements = {
        usernameInput: () => cy.get('#input-email'),
        passwordInput: () => cy.get('#input-password'),
        myAccountInput: () => cy.xpath("//span[normalize-space()='My Account']"),
        loginbuttonSelector: () => cy.xpath("//a[@class='dropdown-item'][normalize-space()='Login']"),
        loginInput: () => cy.contains('button[type="submit"]', 'Login'),
        forgotPassword: () => cy.contains('Forgotten Password')
    };

    visit() {
        cy.visit('http://localhost/index.php?route=account/login&language=en-gb');
    }

    login(email, password) {
        this.elements.myAccountInput().should('be.visible').click();
        this.elements.loginbuttonSelector().should('be.visible').click();
        this.elements.usernameInput().type(email);
        this.elements.passwordInput().type(password);
        this.elements.loginInput().should('be.visible').click();
    }

    forgotPassword() {
        this.elements.forgotPassword().should('be.visible').click();
    }
}

export default new LoginPage();
