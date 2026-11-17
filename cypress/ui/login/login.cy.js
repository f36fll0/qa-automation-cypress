import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import ForgotPasswordPage from "../../pages/ForgotPasswordPage";

describe('Login', () => {
    let user;
    let validUser;

    before(() => {
        cy.fixture('user').then((data) => {
            validUser = data.validUser;
        });
    });

    beforeEach(() => {
        RegisterPage.visit();
    });

    it('Entry page', () => {
        user = {
            ...validUser,
            email: `fran${Date.now()}@gmail.com`,
        };
        cy.registerUser(user);
        cy.url().should('include', '/success');
        RegisterPage.logout();
        LoginPage.visit();
        LoginPage.login(user.email, user.password);
        cy.url().should('include', 'route=account/account');
    });

    it('Entry unregistered email', () => {
        const email = `fran${Date.now() + 23}@gmail.com`;
        user = {
            ...validUser,
            email: `fran${Date.now()}@gmail.com`,
        };
        cy.registerUser(user);
        cy.url().should('include', '/success');
        RegisterPage.logout();
        cy.contains('Logout').should('be.visible').click();
        LoginPage.visit();
        LoginPage.login(email, user.password);
        cy.get('.alert').should('be.visible').and('contain', ' Warning: No match for E-Mail Address and/or Password.');
    });

    it('Entry password incorrect', () => {
        const password = 'Pas123';
        user = {
            ...validUser,
            email: `fran${Date.now()}@gmail.com`,
        };
        cy.registerUser(user);
        cy.url().should('include', '/success');
        RegisterPage.logout();
        LoginPage.visit();
        LoginPage.login(user.email, password);
        cy.get('.alert').should('be.visible').and('contain', ' Warning: No match for E-Mail Address and/or Password.');
    });

    it('Forgot password', () => {
        user = {
            ...validUser,
            email: `fran${Date.now()}@gmail.com`,
        };
        cy.registerUser(user);
        cy.url().should('include', '/success');
        RegisterPage.logout();
        LoginPage.visit();
        LoginPage.forgotPassword();
        cy.url().should('include', '/forgotten');
        ForgotPasswordPage.recoverPassword(user.email);
        cy.url().should('include', '/login');
    });
});

describe('without beforeEach', () => {

    it('Back Login from forgotten page', () => {
        LoginPage.visit();
        LoginPage.forgotPassword();
        cy.url().should('include', '/forgotten');
        ForgotPasswordPage.backLogin();
        cy.url().should('include', '/login');
    });
});
