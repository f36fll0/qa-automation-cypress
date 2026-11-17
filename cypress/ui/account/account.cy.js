import AccountPage from "../../pages/AccountPage";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";

describe('Links are open correctly', () => {
    let user;
    let validUser;

    before(() => {
        cy.fixture('user').then((data) => {
            validUser = data.validUser;
            user = {
                ...validUser,
                email: `fran${Date.now()}@gmail.com`,
            };
            RegisterPage.visit();
            cy.registerUser(user);
        });
    });

    beforeEach(() => {
        LoginPage.visit();
        LoginPage.login(user.email, user.password);
        cy.url({ timeout: 30000 })
            .should('include', 'route=account/account');
    });

    it('Enter Edit account page', () => {
        AccountPage.clickEditAccount();
        cy.url().should('contain', 'route=account/edit');
    });

    it('Enter to password page', () => {
        AccountPage.clickPassword();
        cy.url().should('include', 'route=account/password');
    });

    it('Enter Address Book  page', () => {
        AccountPage.clickAddressBook();
        cy.url().should('include', 'route=account/address');
    });

    it('Enter to WishList Page', () => {
        AccountPage.clickWishList();
        cy.url().should('include', 'route=account/wishlist');
    });

    it('Enter to Order History Page', () => {
        AccountPage.clickOrderHistory();
        cy.url().should('include', 'route=account/order');
    });

    it('Enter to Logout Page', () => {
        AccountPage.clickLogout();
        cy.url({ timeout: 3000 }).should('include', 'route=account/logout');
    });
});
