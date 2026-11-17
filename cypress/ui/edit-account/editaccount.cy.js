import AccountPage from "../../pages/AccountPage";
import RegisterPage from "../../pages/RegisterPage";
import LoginPage from "../../pages/LoginPage";
import EditAccountPage from "../../pages/EditAccountPage";

describe('edit account page', () => {
    let user;
    let user2;

    before(() => {
        let validUser;
        cy.fixture('user').then((data) => {
            validUser = data.validUser;
            user = {
                ...validUser,
                email: `fran${Date.now()}@gmail.com`,
            };
            RegisterPage.visit();
            cy.registerUser(user);
            AccountPage.clickLogout();
            user2 = {
                ...validUser,
                firstname: 'Pedro',
                email: `pedro${Date.now()}@gmail.com`,
            };
            RegisterPage.visit();
            cy.registerUser(user);
        });
    });

    describe('Tests with user', () => {

        beforeEach(() => {
            LoginPage.visit();
            LoginPage.login(user.email, user.password);
            cy.url().should('include', 'route=account/account');
        });

        it('Replace name from edit account page', () => {
            AccountPage.clickEditAccount();
            const newName = EditAccountPage.replaceName();
            EditAccountPage.clickContinue();
            cy.get('.alert').should('be.visible').and('contain', 'Success: Your account has been successfully updated.');
            AccountPage.clickLogout();
            LoginPage.visit();
            LoginPage.login(user.email, user.password);
            cy.url().should('include', 'route=account/account');
            AccountPage.clickEditAccount();
            EditAccountPage.elements.firstnameinput().should('have.value', newName);
            AccountPage.clickLogout();
        });

        it('Replace lastname from my account page', () => {
            AccountPage.clickEditAccount();
            const newLastname = EditAccountPage.replaceLastName();
            EditAccountPage.clickContinue();
            cy.get('.alert').should('be.visible').and('contain', 'Your account has been successfully updated.');
            AccountPage.clickLogout();
            LoginPage.visit();
            LoginPage.login(user.email, user.password);
            cy.url().should('include', 'route=account/account');
            AccountPage.clickEditAccount();
            EditAccountPage.elements.lastnameinput().should('have.value', newLastname);
            AccountPage.clickLogout();
        });

        it('Edit email from my account page', () => {
            AccountPage.clickEditAccount();
            const newEmail = EditAccountPage.modifyEmail(user.email);
            user.email = newEmail;
            EditAccountPage.clickContinue();
            cy.get('.alert').should('be.visible').and('contain', 'Your account has been successfully updated.');
            AccountPage.clickLogout();
            LoginPage.visit();
            LoginPage.login(user.email, user.password);
            cy.url().should('include', 'route=account/account');
            AccountPage.clickEditAccount();
            EditAccountPage.elements.emailinput().should('have.value', newEmail);
            AccountPage.clickLogout();
        });

        it('Replace all fields', () => {
            AccountPage.clickEditAccount();
            const newName = EditAccountPage.replaceName();
            const newLastname = EditAccountPage.replaceLastName();
            const newEmail = EditAccountPage.modifyEmail(user.email);
            user.email = newEmail;
            EditAccountPage.clickContinue();
            cy.get('.alert').should('be.visible').and('contain', 'Your account has been successfully updated.');
            AccountPage.clickLogout();
            LoginPage.visit();
            LoginPage.login(user.email, user.password);
            cy.url().should('include', 'route=account/account');
            AccountPage.clickEditAccount();
            EditAccountPage.elements.firstnameinput().should('have.value', newName);
            EditAccountPage.elements.lastnameinput().should('have.value', newLastname);
            EditAccountPage.elements.emailinput().should('have.value', newEmail);
            AccountPage.clickLogout();
        });
        const fields = ['name', 'lastname', 'mail'];

        it('error alert', () => {
            fields.forEach(field => {
                AccountPage.clickEditAccount();
                EditAccountPage.clearField(field);
                EditAccountPage.clickContinue();
                if (field !== 'mail') {
                    EditAccountPage.getError(field).should('be.visible')
                        .and('contain', 'must be between 1 and 32 characters!');
                }
                else {
                    EditAccountPage.getError(field).should('be.visible')
                        .and('contain', 'E-Mail Address does not appear to be valid!');
                }
            });
        });
    });

    describe('Test with user2', () => {

        beforeEach(() => {
            LoginPage.visit();
            LoginPage.login(user2.email, user2.password);
            cy.url().should('include', 'route=account/account');
        });

        it('Edit name from edit account page', () => {
            AccountPage.clickEditAccount();
            const newName = EditAccountPage.modifyName(user2.firstname);
            EditAccountPage.clickContinue();
            cy.get('.alert')
                .should('be.visible')
                .and('contain', 'Success: Your account has been successfully updated.');
            AccountPage.clickLogout();
            LoginPage.visit();
            LoginPage.login(user2.email, user2.password);
            cy.url()
                .should('include', 'route=account/account');
            AccountPage.clickEditAccount();
            EditAccountPage.elements.firstnameinput()
                .should('have.value', newName);
            AccountPage.clickLogout();
        });
    });
});
