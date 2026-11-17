import RegisterPage from "../../pages/RegisterPage";

describe('User registration', () => {
    let validUser;

    before(() => {
        cy.fixture('user').then((data) => {
            validUser = data.validUser;
        });
    });

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        RegisterPage.visit();
    });

    it('Register user with newsletter subscription', () => {
        const user = {
            ...validUser,
            email: 'fran.api.test@gmail.com'
        };
        cy.registerUser(user);
        cy.url().should('include', '/success');
    });
});
