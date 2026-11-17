class AddAddressBook {
    elements = {
        firstnameinput: () => cy.get('#input-firstname'),
        lastnameinput: () => cy.get('#input-lastname'),
        companyinput: () => cy.get('#input-company'),
        addressinput1: () => cy.get('#input-address-1'),
        addressinput2: () => cy.get('#input-address-2'),
        cityinput: () => cy.get('#input-city'),
        postcodeinput: () => cy.get('#input-postcode'),
        countryinput: () => cy.get('#input-country'),
        regionstateinput: () => cy.get('#input-zone'),
        defaultAdressyesinput: () => cy.get('#input-default-yes'),
        defaultAdressnoinput: () => cy.get('#input-default-no'),
        backbutton: () => cy.xpath("//a[@class='btn btn-light']"),
        editcontinuebutton: () => cy.xpath("//form[@id='form-address']//button[normalize-space()='Continue']"),
        addressbookinput: () => cy.xpath("//li[@class='breadcrumb-item']//a[contains(text(),'Address Book')]")
    };
    errorMessages = {
        firstname: 'First Name must be between 1 and 32 characters!',
        lastname: 'Last Name must be between 1 and 32 characters!',
        address1: 'Address must be between 3 and 128 characters!',
        city: 'City must be between 2 and 128 characters!',
        country: 'Please select a country',
        region: 'Please select a region / state!'
    };

    fieldAddressBookForm({ firstname, lastname, company, address, address2, city, postcode, country, region }) {
        if (firstname !== '' && firstname !== undefined) {
            this.elements.firstnameinput().type(firstname);
        }
        if (lastname !== '' && lastname !== undefined) {
            this.elements.lastnameinput().type(lastname);
        }
        if (company !== '' && company !== undefined) {
            this.elements.companyinput().type(company);
        }
        if (address !== '' && address !== undefined) {
            this.elements.addressinput1().type(address);
        }
        if (address2 !== '' && address2 !== undefined) {
            this.elements.addressinput2().type(address2);
        }
        if (city !== '' && city !== undefined) {
            this.elements.cityinput().type(city);
        }
        if (postcode !== '' && postcode !== undefined) {
            this.elements.postcodeinput().type(postcode);
        }
        if (country !== '' && country !== undefined) {
            this.elements.countryinput().select(country);
        }
        if (region !== '' && region !== undefined) {
            this.elements.regionstateinput().select(region);
        }
    }

    entryFirstName(user) {
        this.elements.firstnameinput().type(user.name);
    }

    entryLastName(user) {
        this.elements.lastnameinput().type(user.lastname);
    }

    entryCommpany(user) {
        this.elements.companyinput().type(user.company);
    }

    entryAddress(address) {
        this.elements.addressinput1().clear().type(address);
    }

    entryCity(user) {
        this.elements.cityinput().type(user.city);
    }

    entryPostcode(user) {
        this.elements.entryPostcode().type(user.postcode);
    }

    entryCountry(user) {
        this.elements.countryinput().select(user.country);
    }

    entryRegion(user) {
        this.elements.regionstateinput().type(user.region);
    }

    entryDefaultAdressYes() {
        this.elements.defaultAdressyesinput().click();
    }

    entryDefaultAdressNo() {
        this.elements.defaultAdressnoinput().click();
    }

    backButton() {
        this.elements.backbutton().click();
    }

    emptyNewAddressFields(user) {
        if (user.firstname == '') {
            cy.get('#error-firstname').should('be.visible').and('contain', this.errorMessages.firstname);
        }
        if (user.lastname == '') {
            cy.get('#error-lastname').should('be.visible').and('contain', this.errorMessages.lastname);
        }
        if (user.address == '') {
            cy.get('#error-address-1').should('be.visible').and('contain', this.errorMessages.address1);
        }
        if (user.city == '') {
            cy.get('#error-city').should('be.visible').and('contain', this.errorMessages.city);
        }
        if (user.country == '') {
            cy.get('#error-country').should('not.be.visible').then(() => {
                cy.get('#error-zone').should('be.visible').and('contain', this.errorMessages.region);
            });
        }
    }

    countryField() {
        this.elements.countryinput().select('--- Please Select ---').then(() => {
            this.elements.regionstateinput().should('be.visible').and('have.value', '0');
        });
    }

    verifyErrorCountry() {
        cy.get('#error-country').should('be.visible').and('contain', this.errorMessages.country);
    }

    deleteAddress(firstname) {
        cy.contains('td', firstname)
            .parent('tr')
            .find('.btn-danger')
            .click();
    }

    editAddress(firstname) {
        cy.contains('td', firstname)
            .parent('tr')
            .find('.btn-primary')
            .click();
    }

    editContinue() {
        this.elements.editcontinuebutton().click();
    }

    clickAddressBookBreadcrumb() {
        this.elements.addressbookinput().click();
    }
}

export default new AddAddressBook();
