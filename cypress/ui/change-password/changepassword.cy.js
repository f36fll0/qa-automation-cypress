import RegisterPage from "../../pages/RegisterPage";
import LoginPage from "../../pages/LoginPage";
import AccountPage from "../../pages/AccountPage";
import ChangePasswordPage from "../../pages/ChangePasswordPage";

describe('Check the change of the password page', () => {
    let user;
    let validUser;

    beforeEach(() => {
        cy.fixture('user').then((data) => {
            validUser = data.validUser;
            user = {
                ...validUser,
                email: `fran${Date.now()}@gmail.com`,
            };
            RegisterPage.visit();
            cy.registerUser(user);
            AccountPage.clickLogout();
            LoginPage.visit();
            LoginPage.login(user.email, user.password);
            cy.url().should('include', 'route=account/account');
            AccountPage.clickPassword();
            cy.url().should('include', 'route=account/password');
        });
    });

    it('check the new password is changed', () => {
        const newPassword = '123fxl';
        ChangePasswordPage.enterPassword(newPassword);
        ChangePasswordPage.changePassword(newPassword);
        ChangePasswordPage.continueButton();
        cy.get('.alert').should('contain.text', 'Success: Your password has been successfully updated.');
        cy.url().should('include', 'route=account/password');
        AccountPage.clickLogout();
        cy.url().should('include', 'route=account/logout');
        LoginPage.login(user.email, newPassword);
        cy.url().should('include', 'route=account/account');
    });

    it('verify that the length is incorrect', () => {
        const newPassword = '123fx';
        ChangePasswordPage.enterPassword(newPassword);
        ChangePasswordPage.changePassword(newPassword);
        ChangePasswordPage.continueButton();
        cy.get('#error-password').should('be.visible').and('contain.text', 'Password must be between 6 and 40 characters!');
    });

    it('verify that one value does not match the other', () => {
        const newPassword = '123fx1';
        const confirmPassword = '123fx2';
        ChangePasswordPage.enterPassword(newPassword);
        ChangePasswordPage.changePassword(confirmPassword);
        ChangePasswordPage.continueButton();
        cy.get('#error-confirm').should('be.visible').and('contain.text', 'Password confirmation does not match password!');
    });

    it('verify that back button works correcty', () => {
        ChangePasswordPage.backButton();
        cy.url().should('include', 'route=account/account');
    });
});
