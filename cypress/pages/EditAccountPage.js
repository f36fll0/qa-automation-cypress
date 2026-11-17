class EditAccount {
    elements = {
        firstnameinput: () => cy.get('#input-firstname'),
        lastnameinput: () => cy.get('[name="lastname"]'),
        emailinput: () => cy.get('[name="email"]'),
        continuebutton: () => cy.xpath("//button[normalize-space()='Continue']"),
        backbutton: () => cy.contains('a', 'back')
    };

    replaceName() {
        const newName = 'Juan';
        this.elements.firstnameinput().clear().type(newName);
        return newName;
    }

    replaceLastName() {
        const newLastname = 'Lobato';
        this.elements.lastnameinput().clear().type(newLastname);
        return newLastname;
    }

    modifyEmail(mail) {
        const modifyNewEmail = mail.replace('fran', 'juan');
        this.elements.emailinput().clear().type(modifyNewEmail);
        return modifyNewEmail;
    }

    modifyName(name) {
        const modifyName = `${name.slice(0, -1)}ito`;
        this.elements.firstnameinput().clear().type(modifyName);
        return modifyName;
    }

    clickContinue() {
        this.elements.continuebutton().click();
    }

    clearField(field) {
        const fields = {
            name: () => this.elements.firstnameinput(),
            lastname: () => this.elements.lastnameinput(),
            mail: () => this.elements.emailinput()
        };
        fields[field]().clear();
    }

    getError(field) {
        const errors = {
            name: () => cy.get('#error-firstname'),
            lastname: () => cy.get('#error-lastname'),
            mail: () => cy.get('#error-email')
        };
        return errors[field]();
    }
}

export default new EditAccount();
