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
            email: `fran${Date.now()}@gmail.com`
        };
        cy.registerUser(user);
        cy.url().should('include', '/success');
    });

    it('Register user without newsletter subscription', () => {
        const user = {
            ...validUser,
            email: `fran${Date.now()}@gmail.com`,
        };
        cy.registerUser(user);
        cy.url().should('include', '/success');
    });
    it('Insert user already exists', () => {
        const user = {
            ...validUser,
            email: `fran${Date.now()}@gmail.com`,
        };
        cy.registerUser(user);
        cy.url().should('include', '/success');
        RegisterPage.logout();
        cy.url().should('include', 'route=account/logout');
        RegisterPage.visit();
        cy.url().should('include', 'route=account/register');
        cy.registerUser(user);
        RegisterPage.verifyUserAlreadyRegistered();
    });

    it('insert wrong mail Form', () => {
        const user = {
            ...validUser,
            email: `fran${Date.now()}gmail.com`,
        };
        cy.registerUser(user);
        cy.get('#input-email').then(($input) => {
            expect($input[0].checkValidity()).to.be.false;
        });
    });
    const requiredFields = ['firstname', 'lastname', 'email', 'password'];
    requiredFields.forEach((field) => {

        it(`${field} is required`, () => {
            const user = {
                ...validUser,
                email: `fran${Date.now()}@gmail.com`,
            };
            user[field] = '';
            cy.registerUser(user);
            cy.url().should('include', 'route=account/register');
            RegisterPage.verifyFieldEmpty(field);
        });
    });
    const passwordLength = { password: 6 };

    it('Password is below minimum length', () => {
        const user = {
            ...validUser,
            email: `fran${Date.now()}@gmail.com`,
        };
        user['password'] = Array.from({ length: passwordLength.password - 1 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
        cy.registerUser(user);
        RegisterPage.verifyFieldError('password');
    });
    const maxLength = {
        firstname: 32,
        lastname: 32,
        email: 96,
        password: 40
    };
    ['firstname', 'lastname', 'email', 'password'].forEach(field => {

        it(`${field} exceeds max length`, () => {
            const user = {
                ...validUser,
                email: `fran${Date.now()}@gmail.com`,
            };
            if (field !== 'email') {
                user[field] = Array.from({ length: maxLength[field] + 1 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
            }
            else {
                const domain = '@gmail.com';
                user[field] = Array.from({ length: maxLength[field] + 1 - domain.length }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('') + domain;
            }
            cy.registerUser(user);
            RegisterPage.verifyFieldError(field);
        });
    });

    it('do not accept the privat policy', () => {
        const user = {
            ...validUser,
            email: `fran${Date.now()}@gmail.com`,
        };
        RegisterPage.fillRegisterForm(user);
        RegisterPage.verifyNotCheckedPrivacyButton();
    });
});
