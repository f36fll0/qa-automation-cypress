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

    cy.intercept('POST', '**/index.php?route=account/login*')
        .as('login');

    this.elements.usernameInput().should('be.visible').type(email);
    this.elements.passwordInput().should('be.visible').type(password);
    this.elements.loginInput().should('be.visible').click();

    cy.wait('@login').then((interception) => {

        cy.log('Login status:', interception.response?.statusCode);

        cy.log(
            'Login response:',
            JSON.stringify(interception.response?.body)
        );

        expect(interception.response).to.exist;
        expect(interception.response.statusCode).to.eq(200);

    });

}

    forgotPassword() {
        this.elements.forgotPassword().should('be.visible').click();
    }
}

export default new LoginPage();
