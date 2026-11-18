const temp = 2000;

class RegisterPage {
    elements = {
        firstnameinput: () => cy.get('#input-firstname'),
        lastnameinput: () => cy.get('#input-lastname'),
        emailinput: () => cy.get('#input-email'),
        passwordinput: () => cy.get('#input-password'),
        privacybutton: () => cy.get('input[type="checkbox"][name="agree"]'),
        continuebutton: () => cy.contains('button', 'Continue').first(),
        subscribebutton: () => cy.get('#input-newsletter')
    };

    visit() {
        cy.visit('/index.php?route=account/register&language=en-gb');
    }

    fillRegisterForm({ firstname, lastname, email, password }) {
       
         cy.log(`fillRegisterForm: ${firstname} ${lastname}`)
        if (firstname !== undefined && firstname !== '') {
            this.elements.firstnameinput().clear().type(firstname);
        }
        if (lastname !== undefined && lastname !== '') {
            this.elements.lastnameinput().clear().type(lastname);
        }
        if (email !== undefined && email !== '') {
            this.elements.emailinput().clear().type(email);
        }
        if (password !== undefined && password !== '') {
            this.elements.passwordinput().clear().type(password);
        }
    }

    logout() {
        cy.contains('My Account')
            .should('be.visible')
            .click();
        cy.contains('a', 'Logout')
            .should('be.visible')
            .click();
    }

    verifyUserAlreadyRegistered() {
        cy.get('#alert')
            .should('be.visible')
            .and('contain', 'Warning: E-Mail Address is already registered!');
    }

    verifyFieldEmpty(field) {
        const errorMessages = {
            firstname: 'First Name must be between 1 and 32 characters!',
            lastname: 'Last Name must be between 1 and 32 characters!',
            email: 'E-Mail Address does not appear to be valid!',
            password: 'Password must be between 6 and 40 characters!'
        };
        cy.get(`#error-${field}`).should('be.visible').and('contain', errorMessages[field]);
    }

    clickSubscribe() {
        this.elements.subscribebutton().should('not.be.checked').click();
    }

    verifySubscribeNotChecked() {
        this.elements.subscribebutton()
            .should('not.be.checked');
    }

    clickPrivacyPolicy() {
        this.elements.privacybutton().should('not.be.checked').click();
    }

    clickContinue() {
        this.elements.continuebutton().should('not.be.disabled').click();
    }

    verifyFieldError(field) {
        const errorMessages = {
            firstname: 'First Name must be between 1 and 32 characters!',
            lastname: 'Last Name must be between 1 and 32 characters!',
            email: 'E-Mail Address does not appear to be valid!',
            password: 'Password must be between 6 and 40 characters!'
        };
        cy.get(`#error-${field}`).should('be.visible').and('contain', errorMessages[field]);
    }

    verifyNotCheckedPrivacyButton() {
        this.elements.continuebutton().should('not.be.disabled').click();
        cy.get('#alert').should('be.visible').and('contain', 'Warning: You must agree to the Privacy Policy!');
    }
}

export default new RegisterPage();
